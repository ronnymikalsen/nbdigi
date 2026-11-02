import { computed, DestroyRef, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { firstValueFrom, Subject } from 'rxjs';
import { takeUntil, timeout } from 'rxjs/operators';
import { Criteria, DateOptions, Genre, SortOptions } from '../core/models';
import {
  ChatSearchCriteria,
  ChatSearchRequestError,
  ChatSearchService,
  copyCriteria,
  describeSearch,
  getChatResultGroups,
  getChatMediaTypes,
  SearchChatResultGroup,
  SearchChatFilter,
  SearchChatMessage,
} from '../core/services/chat-search.service';

type SearchStatus =
  | 'idle'
  | 'interpreting'
  | 'resolving'
  | 'searching'
  | 'ready'
  | 'error';
interface ChatSnapshot {
  criteria: ChatSearchCriteria;
  messages: SearchChatMessage[];
  resultGroups: SearchChatResultGroup[];
  total?: number;
  pagination: boolean;
}
interface AiSearchState {
  criteria: ChatSearchCriteria;
  messages: SearchChatMessage[];
  status: SearchStatus;
  error: string;
  _undoHistory: ChatSnapshot[];
  _resultGroups: SearchChatResultGroup[];
  _total: number | undefined;
}

function initialState(): AiSearchState {
  return {
    criteria: copyCriteria(new Criteria()),
    messages: [],
    status: 'idle',
    error: '',
    _undoHistory: [],
    _resultGroups: [],
    _total: undefined,
  };
}
const isPending = (status: SearchStatus) =>
  ['interpreting', 'resolving', 'searching'].includes(status);

/** In-memory chat session, independent of the classic NgRx search feature. */
export const AiSearchStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    pending: computed(() => isPending(store.status())),
    canUndo: computed(
      () => store._undoHistory().length > 0 && !isPending(store.status()),
    ),
    pendingLabel: computed(() =>
      store.status() === 'searching'
        ? 'Søker i katalogen …'
        : store.status() === 'resolving'
        ? 'Sjekker avgrensningene …'
        : 'Tenker …',
    ),
  })),
  withMethods((store, api = inject(ChatSearchService)) => {
    let revision = 0;
    let controller: AbortController | undefined;
    const cancelled = new Subject<void>();

    function cancel(): void {
      revision++;
      controller?.abort();
      cancelled.next();
    }
    inject(DestroyRef).onDestroy(() => {
      cancel();
      cancelled.complete();
    });

    function remember(
      criteria: ChatSearchCriteria,
      messages: SearchChatMessage[],
      pagination = false,
    ): void {
      patchState(store, (state) => ({
        _undoHistory: [
          ...state._undoHistory,
          {
            criteria: copyCriteria(criteria),
            messages,
            resultGroups: state._resultGroups,
            total: state._total,
            pagination,
          },
        ].slice(-20),
      }));
    }

    function append(
      role: SearchChatMessage['role'],
      text: string,
      resultGroups?: SearchChatResultGroup[],
      total?: number,
    ): void {
      patchState(store, (state) => ({
        messages: [
          ...state.messages,
          { role, text, resultGroups, total },
        ].slice(-20),
      }));
    }

    function finish(requestRevision: number): void {
      if (requestRevision === revision && store.status() !== 'error')
        patchState(store, { status: 'ready' });
    }

    async function runSearch(
      criteria: ChatSearchCriteria,
      requestRevision: number,
      prefix = '',
    ): Promise<void> {
      patchState(store, {
        status: 'searching',
        criteria: copyCriteria(criteria),
        _resultGroups: [],
        _total: undefined,
      });
      try {
        const result = await firstValueFrom(
          api
            .search(criteria)
            .pipe(timeout({ first: 45000 }), takeUntil(cancelled)),
          { defaultValue: null },
        );
        if (!result || requestRevision !== revision) return;
        const count = result.totalElements;
        if (!Number.isFinite(count) || count < 0)
          throw new Error('Invalid catalogue result count');
        const groups = getChatResultGroups(
          result,
          getChatMediaTypes(criteria),
          criteria.resultLimit,
        );
        patchState(store, { _resultGroups: groups, _total: count });
        append(
          'assistant',
          `${prefix}Fant ${new Intl.NumberFormat('nb-NO').format(
            count,
          )} treff. ${describeSearch(criteria)}.`,
          groups,
          count,
        );
      } catch (error) {
        if (requestRevision !== revision) return;
        console.error('Could not load chat search results', error);
        append(
          'assistant',
          `${prefix}Søket er oppdatert, men katalogen kunne ikke hente treffene. Du kan angre endringen.`,
        );
      }
    }

    async function changeCriteria(
      change: (criteria: ChatSearchCriteria) => ChatSearchCriteria,
      message: string,
    ): Promise<void> {
      if (store.pending()) return;
      const requestRevision = revision;
      const current = store.criteria();
      remember(current, store.messages());
      append('user', message);
      patchState(store, { error: '' });
      try {
        await runSearch(change(current), requestRevision);
      } finally {
        finish(requestRevision);
      }
    }

    async function loadMore(
      selected: readonly string[],
      history: SearchChatMessage[],
      requestRevision: number,
    ): Promise<void> {
      const groups = store._resultGroups();
      if (!groups.length) {
        append('assistant', 'Start med et søk, så kan du be om flere treff.');
        return;
      }
      if (
        !groups.some(
          (group) =>
            group.nextLink &&
            (selected.includes('alle') ||
              selected.includes(group.mediaType ?? '')),
        )
      ) {
        append(
          'assistant',
          'Det er ingen flere treff å hente for de valgte medietypene.',
        );
        return;
      }
      patchState(store, { status: 'searching' });
      try {
        const expanded = await firstValueFrom(
          api
            .loadMore(groups, selected)
            .pipe(timeout({ first: 45000 }), takeUntil(cancelled)),
          { defaultValue: null },
        );
        if (!expanded || requestRevision !== revision) return;
        remember(store.criteria(), history, true);
        patchState(store, { _resultGroups: expanded });
        // Retain accumulated cards internally for deduplication and cursors;
        // this answer shows only the newly fetched cards in fresh carousels.
        const pages = expanded
          .map((group) => ({
            ...group,
            items: group.items.slice(
              groups.find((previous) => previous.mediaType === group.mediaType)
                ?.items.length ?? 0,
            ),
          }))
          .filter((group) => group.items.length > 0);
        const added = pages.reduce((n, group) => n + group.items.length, 0);
        append(
          'assistant',
          `Hentet ${added} nye treff. ${describeSearch(store.criteria())}.`,
          pages,
          store._total(),
        );
      } catch (error) {
        if (requestRevision !== revision) return;
        console.error('Could not load next chat search page', error);
        append(
          'assistant',
          'Kunne ikke hente flere treff. Prøv «flere» igjen.',
        );
      }
    }

    return {
      async send(text: string, defaultResultLimit = 4): Promise<void> {
        const message = text.trim();
        if (!message || message.length > 1000 || store.pending()) return;
        const requestRevision = revision;
        const current = store.criteria();
        const history = store.messages();
        controller = new AbortController();
        append('user', message);
        patchState(store, { status: 'interpreting', error: '' });
        try {
          if (
            /^(?:(?:vis|hent|gi meg)\s+)?(?:flere(?:\s+(?:treff|resultater))?|mer|neste(?:\s+side)?)[.!?]*$/iu.test(
              message,
            )
          ) {
            await loadMore(['alle'], history, requestRevision);
            return;
          }
          let result = await api.interpret(
            message,
            copyCriteria(current, { defaultResultLimit }),
            history,
            controller.signal,
          );
          if (requestRevision !== revision) return;
          if (result.more) {
            await loadMore(result.more, history, requestRevision);
            return;
          }
          if (result.criteria) {
            patchState(store, { status: 'resolving' });
            result = await api.resolveFilters(result.criteria, current);
          }
          if (requestRevision !== revision) return;
          remember(current, history);
          if (result.criteria)
            await runSearch(result.criteria, requestRevision);
          else if (result.clarification)
            append('assistant', result.clarification);
        } catch (error) {
          if (requestRevision !== revision) return;
          console.error('Could not interpret chat search', error);
          const reason =
            error instanceof ChatSearchRequestError
              ? error.stage === 'app-check'
                ? 'Kunne ikke bekrefte tilkoblingen til Firebase.'
                : error.timedOut
                ? 'KI-tjenesten brukte for lang tid på å svare.'
                : 'KI-tjenesten kunne ikke svare.'
              : 'KI-søket kunne ikke fullføres.';
          patchState(store, {
            status: 'error',
            error: `${reason} Du kan bruke Vanlig søk. Søket ditt er ikke endret.`,
          });
        } finally {
          finish(requestRevision);
        }
      },

      async undo(): Promise<void> {
        if (!store.canUndo()) return;
        const snapshot = store._undoHistory().at(-1);
        if (!snapshot) return;
        const requestRevision = revision;
        patchState(store, (state) => ({
          _undoHistory: state._undoHistory.slice(0, -1),
          messages: snapshot.messages,
          error: '',
        }));
        if (snapshot.pagination) {
          patchState(store, {
            criteria: copyCriteria(snapshot.criteria),
            _resultGroups: snapshot.resultGroups,
            _total: snapshot.total,
            status: 'ready',
          });
          return;
        }
        try {
          await runSearch(
            snapshot.criteria,
            requestRevision,
            'Angret siste endring. ',
          );
        } finally {
          finish(requestRevision);
        }
      },

      newestFirst(): Promise<void> {
        return changeCriteria(
          (current) =>
            copyCriteria(current, { sort: new SortOptions().dateDesc }),
          'Vis nyeste først',
        );
      },

      removeFilter(chip: SearchChatFilter): Promise<void> {
        return changeCriteria((current) => {
          switch (chip.type) {
            case 'query':
              return copyCriteria(current, { q: '' });
            case 'mediaType':
              return copyCriteria(current, { mediaType: 'alle' });
            case 'date':
              return copyCriteria(current, { date: new DateOptions().anytime });
            case 'sort':
              return copyCriteria(current, {
                sort: new SortOptions().relevance,
              });
            case 'genre':
              return copyCriteria(current, { genre: new Genre() });
            case 'hint':
              return copyCriteria(current, {
                filters: current.filters.filter(
                  (filter) => filter.value !== chip.value,
                ),
              });
          }
        }, `Fjern avgrensningen «${chip.label}»`);
      },

      reset(): void {
        cancel();
        patchState(store, initialState());
      },
    };
  }),
);
