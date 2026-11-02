import {
  computed,
  inject,
  Injectable,
  InjectionToken,
  signal,
} from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import type { GenerativeModel } from 'firebase/ai';
import type { AppCheck } from 'firebase/app-check';
import { Actions, ofType } from '@ngrx/effects';
import { firstValueFrom, merge, Subject } from 'rxjs';
import { filter, map, take, timeout } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { SearchFacade } from '../../+state/search/search.facade';
import {
  Criteria,
  DateOption,
  DateOptions,
  Genre,
  Hint,
  SortOptions,
} from '../models';
import {
  Search,
  SearchActionTypes,
  SearchError,
  SearchSuccess,
} from '../../+state/search/search.actions';
import { TypeaheadService } from './typeahead.service';

export interface SearchChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

export interface SearchChatFilter {
  type: 'query' | 'mediaType' | 'date' | 'sort' | 'genre' | 'hint';
  label: string;
  value?: string;
}

function copyCriteria(
  criteria: Criteria,
  changes: NonNullable<ConstructorParameters<typeof Criteria>[0]> = {},
): Criteria {
  return new Criteria({
    q: criteria.q,
    mediaType: criteria.mediaType,
    date: criteria.date,
    sort: criteria.sort,
    genre: criteria.genre,
    filters: [...criteria.filters],
    ...changes,
  });
}

const catalogueFields = {
  place: 'subjectgeographic',
  creator: 'namecreators',
} as const;
const filterIs = (hint: Hint, type: keyof typeof catalogueFields) =>
  hint.value.startsWith(`${catalogueFields[type]}:`);
const normaliseName = (name: string) =>
  name.normalize('NFKC').trim().toLocaleLowerCase('nb-NO');

function describeSearch(criteria: Criteria): string {
  return [
    criteria.q ? `«${criteria.q}»` : 'alle emner',
    criteria.mediaType === 'alle' ? 'alle medietyper' : criteria.mediaType,
    criteria.date.value ? criteria.date.viewValue : null,
    ...criteria.filters.filter((f) => f.enabled).map((f) => f.label),
    criteria.genre?.value ? criteria.genre.viewValue : null,
    criteria.sort.value !== new SortOptions().relevance.value
      ? criteria.sort.viewValue
      : null,
  ]
    .filter(Boolean)
    .join(' · ');
}

export class ChatSearchRequestError extends Error {
  constructor(
    readonly stage: 'app-check' | 'model',
    readonly timedOut: boolean,
    cause?: unknown,
  ) {
    super(`Chat search ${stage} ${timedOut ? 'timed out' : 'failed'}`, {
      cause,
    });
  }
}

function isTimeout(error: unknown): boolean {
  return (
    error instanceof Error &&
    (error.name === 'TimeoutError' || error.name === 'AbortError')
  );
}

/** App Check token retrieval precedes fetch, so bound it independently. */
export async function verifyChatAppCheck(
  check: () => Promise<unknown>,
): Promise<void> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    await Promise.race([
      check(),
      new Promise<never>((_, reject) => {
        timer = setTimeout(
          () => reject(new ChatSearchRequestError('app-check', true)),
          20000,
        );
      }),
    ]);
  } catch (error) {
    if (error instanceof ChatSearchRequestError) throw error;
    throw new ChatSearchRequestError('app-check', isTimeout(error), error);
  } finally {
    clearTimeout(timer);
  }
}

const mediaTypes = [
  'alle',
  'bilder',
  'bøker',
  'aviser',
  'tidsskrift',
  'kart',
  'noter',
  'musikkmanuskripter',
  'plakater',
  'privatarkivmateriale',
  'programrapporter',
];

function yearRange(criteria: Criteria): [number | null, number | null] {
  if (!criteria.date.value) return [null, null];
  const from = Number(criteria.date.fromDate?.slice(0, 4));
  const to = Number(criteria.date.toDate?.slice(0, 4));
  return [from > 1 ? from : null, to < 4999 ? to : null];
}

/** Validate model output before it can change the catalogue search. */
export function applyChatSearchPlan(
  value: unknown,
  current: Criteria,
): {
  criteria?: Criteria;
  clarification?: string;
} {
  if (!value || typeof value !== 'object')
    throw new Error('Invalid search plan');
  const plan = value as Record<string, unknown>;
  if (plan['action'] === 'clarify') {
    if (typeof plan['message'] !== 'string' || !plan['message'].trim()) {
      throw new Error('Missing clarification');
    }
    return { clarification: plan['message'].slice(0, 600) };
  }
  const { q, mediaType, fromYear, toYear, sort, reset, places, creators } =
    plan;
  const validNames = (names: unknown): names is string[] | undefined =>
    names === undefined ||
    (Array.isArray(names) &&
      names.length <= 5 &&
      names.every(
        (name) =>
          typeof name === 'string' &&
          name.trim().length > 0 &&
          name.length <= 200 &&
          [...name].every((character) => character.charCodeAt(0) >= 32),
      ));
  const validYear = (year: unknown): year is number | null =>
    year === null ||
    (typeof year === 'number' &&
      Number.isInteger(year) &&
      year >= 1 &&
      year <= 4999);
  const sortOption = new SortOptions().all.find(
    (option) => option.value === sort,
  );
  if (
    plan['action'] !== 'search' ||
    typeof q !== 'string' ||
    q.length > 500 ||
    typeof mediaType !== 'string' ||
    !mediaTypes.includes(mediaType) ||
    !validYear(fromYear) ||
    !validYear(toYear) ||
    (fromYear !== null && toYear !== null && fromYear > toYear) ||
    !sortOption ||
    typeof reset !== 'boolean' ||
    !validNames(places) ||
    !validNames(creators)
  ) {
    throw new Error('Invalid search criteria');
  }
  const base = reset ? new Criteria() : current;
  let filters = [...base.filters];
  for (const [type, names] of [
    ['place', places],
    ['creator', creators],
  ] as const) {
    if (names === undefined) continue;
    const previous = filters.filter((hint) => filterIs(hint, type));
    filters = filters.filter((hint) => !filterIs(hint, type));
    for (const name of [...new Set(names.map((n) => n.trim()))]) {
      const existing = previous.find(
        (hint) => normaliseName(hint.label) === normaliseName(name),
      );
      // Only these two catalogue fields can be produced by the model.
      const escapedName = name.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
      filters.push(
        existing
          ? new Hint({ ...existing, enabled: true })
          : new Hint({
              type: type === 'place' ? 'place' : 'person',
              label: name,
              value: `${catalogueFields[type]}:"${escapedName}"`,
            }),
      );
    }
  }
  const [oldFrom, oldTo] = yearRange(base);
  let date = base.date;
  if (oldFrom !== fromYear || oldTo !== toYear) {
    if (fromYear === null && toYear === null) {
      date = new DateOptions().anytime;
    } else {
      const fromDate = `${String(fromYear ?? 1).padStart(4, '0')}0101`;
      const toDate = `${String(toYear ?? 4999).padStart(4, '0')}1231`;
      date = new DateOption({
        fromDate,
        toDate,
        value: `date:[${fromDate} TO ${toDate}]`,
        viewValue:
          fromYear && toYear
            ? `${fromYear}–${toYear}`
            : fromYear
            ? `Fra ${fromYear}`
            : `Til og med ${toYear}`,
      });
    }
  }
  return {
    criteria: new Criteria({
      filters,
      genre: base.genre,
      q: q.trim(),
      mediaType,
      date,
      sort: sortOption,
    }),
  };
}

type SearchPlanGenerator = (
  message: string,
  criteria: Criteria,
  history: SearchChatMessage[],
) => Promise<unknown>;

/** Lazy SDK loading keeps ordinary catalogue search independent of AI setup. */
export const SEARCH_PLAN_GENERATOR = new InjectionToken<SearchPlanGenerator>(
  'SEARCH_PLAN_GENERATOR',
  {
    providedIn: 'root',
    factory: () => {
      const app = inject(FirebaseApp);
      let model: GenerativeModel | undefined;
      let appCheck: AppCheck | undefined;
      return async (message, criteria, history) => {
        if (!appCheck) {
          const { initializeAppCheck, ReCaptchaEnterpriseProvider } =
            await import('firebase/app-check');
          if (environment.production && !environment.ai.appCheckSiteKey) {
            throw new Error(
              'Configure environment.ai.appCheckSiteKey before using AI in production.',
            );
          }
          if (!environment.production) {
            // Firebase prints a browser-specific token to register in App Check.
            (
              globalThis as typeof globalThis & {
                FIREBASE_APPCHECK_DEBUG_TOKEN?: boolean;
              }
            ).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
          }
          appCheck = initializeAppCheck(app, {
            provider: new ReCaptchaEnterpriseProvider(
              environment.ai.appCheckSiteKey || 'debug',
            ),
            isTokenAutoRefreshEnabled: true,
          });
        }
        const { getToken } = await import('firebase/app-check');
        const activeAppCheck = appCheck;
        await verifyChatAppCheck(() => getToken(activeAppCheck));
        if (!model) {
          const { getAI, getGenerativeModel, GoogleAIBackend, Schema } =
            await import('firebase/ai');
          model = getGenerativeModel(
            getAI(app, {
              backend: new GoogleAIBackend(),
              useLimitedUseAppCheckTokens: true,
            }),
            {
              model: environment.ai.model,
              systemInstruction: `You interpret catalogue searches for the National Library of Norway.
Return the complete next search criteria using the supplied current criteria as the source of truth.
Follow-ups preserve subject, media type, dates and sort unless explicitly changed. Never use conversation history to restore filters the user removed manually.
Translate ordinary English subjects to Norwegian catalogue keywords (dogs -> hunder), preserving names and explicit quoted phrases.
Images/photos/bilder means mediaType bilder. All media types means alle.
After year 2000 means fromYear 2001; before 2000 means toYear 1999. Since/from 2000 includes 2000.
Null year means no bound; remove the date restriction means both years null.
reset=true only for an explicit request to start a new search or clear all filters; use defaults for unspecified fields then.
Supported changes: subject q, mediaType, whole-year date bounds, sort, places and creators (photographer/author).
places and creators are optional arrays of names, NOT filter syntax. Omit them when unchanged. If changing one category, return ALL desired names in that category; [] removes that category. Existing other filters are preserved unless reset=true.
Multiple names within a category are AND restrictions. If the user requests OR alternatives between names, clarify that one location/person at a time is supported.
"Bare fra Oslo" sets places=["Oslo"], preserving the subject and all other criteria. "Fotografert av Anders Beer Wilse" sets creators=["Anders Beer Wilse"]. Do not repeat place or creator names in q when they belong in a filter. Never invent a person's name or silently choose among ambiguous catalogue candidates.
For unsupported changes, ambiguous requests or questions unrelated to catalogue search, use action clarify and a short question/explanation in the user's language. Do not claim to have found images, generated images or inspected their contents.
q contains only catalogue search terms, never the full chat request. No raw catalogue filter expressions.
For action search, message is empty. For clarify, retain current criteria and explain in message.`,
              generationConfig: {
                responseMimeType: 'application/json',
                thinkingConfig: { thinkingLevel: environment.ai.thinkingLevel },
                maxOutputTokens: 2048,
                responseSchema: Schema.object({
                  properties: {
                    action: Schema.enumString({ enum: ['search', 'clarify'] }),
                    message: Schema.string(),
                    q: Schema.string(),
                    mediaType: Schema.enumString({ enum: mediaTypes }),
                    fromYear: Schema.integer({ nullable: true }),
                    toYear: Schema.integer({ nullable: true }),
                    sort: Schema.enumString({
                      enum: new SortOptions().all
                        .map((s) => s.value)
                        .filter((value): value is string => value !== null),
                    }),
                    reset: Schema.boolean(),
                    places: Schema.array({ items: Schema.string() }),
                    creators: Schema.array({ items: Schema.string() }),
                  },
                  optionalProperties: ['places', 'creators'],
                }),
              },
            },
            { timeout: 90000 },
          );
        }
        const [fromYear, toYear] = yearRange(criteria);
        let result;
        try {
          result = await model.generateContent(
            JSON.stringify({
              currentCriteria: {
                q: criteria.q,
                mediaType: criteria.mediaType,
                fromYear,
                toYear,
                sort: criteria.sort.value,
                places: criteria.filters
                  .filter((f) => f.enabled && filterIs(f, 'place'))
                  .map((f) => f.label),
                creators: criteria.filters
                  .filter((f) => f.enabled && filterIs(f, 'creator'))
                  .map((f) => f.label),
                otherFilters: criteria.filters
                  .filter((f) => f.enabled)
                  .map((f) => f.label),
                genre: criteria.genre?.viewValue,
              },
              recentConversation: history.slice(-8),
              message,
            }),
          );
        } catch (error) {
          throw new ChatSearchRequestError('model', isTimeout(error), error);
        }
        return JSON.parse(result.response.text());
      };
    },
  },
);

@Injectable({ providedIn: 'root' })
export class ChatSearchService {
  private readonly search = inject(SearchFacade);
  private readonly actions = inject(Actions);
  private readonly typeahead = inject(TypeaheadService);
  private readonly generate = inject(SEARCH_PLAN_GENERATOR);
  private readonly chatMessages = signal<SearchChatMessage[]>([]);
  private readonly waiting = signal(false);
  private readonly progress = signal('Tolker søket ditt …');
  private readonly failure = signal('');
  private readonly snapshots = signal<
    { criteria: Criteria; messages: SearchChatMessage[] }[]
  >([]);
  private readonly cancelled = new Subject<void>();
  private revision = 0;
  private requestNumber = 0;

  readonly messages = this.chatMessages.asReadonly();
  readonly pending = this.waiting.asReadonly();
  readonly pendingLabel = this.progress.asReadonly();
  readonly error = this.failure.asReadonly();
  readonly canUndo = computed(
    () => this.snapshots().length > 0 && !this.pending(),
  );

  async send(text: string): Promise<void> {
    const message = text.trim();
    if (!message || message.length > 1000 || this.pending()) return;
    const revision = this.revision;
    const history = this.messages();
    this.append('user', message);
    this.waiting.set(true);
    this.progress.set('Tolker søket ditt …');
    this.failure.set('');
    try {
      const current = await firstValueFrom(this.search.getCriteria$);
      const plan = await this.generate(message, current, history);
      if (revision !== this.revision) return;
      let result = applyChatSearchPlan(plan, current);
      if (result.criteria) {
        this.progress.set('Sjekker avgrensningene …');
        result = await this.resolveFilters(result.criteria, current);
      }
      if (revision !== this.revision) return;
      const latest = await firstValueFrom(this.search.getCriteria$);
      if (latest !== current)
        throw new Error('Search changed while interpreting the message');
      this.remember(current, history);
      if (result.criteria) {
        await this.runSearch(result.criteria, revision);
      } else if (result.clarification) {
        this.append('assistant', result.clarification);
      }
    } catch (error) {
      if (revision !== this.revision) return;
      console.error('Could not interpret chat search', error);
      const reason =
        error instanceof ChatSearchRequestError
          ? error.stage === 'app-check'
            ? 'Kunne ikke bekrefte tilkoblingen til Firebase.'
            : error.timedOut
            ? 'KI-tjenesten brukte for lang tid på å svare.'
            : 'KI-tjenesten kunne ikke svare.'
          : 'KI-søket kunne ikke fullføres.';
      this.failure.set(
        `${reason} Du kan bruke Vanlig søk. Søket ditt er ikke endret.`,
      );
    } finally {
      if (revision === this.revision) this.waiting.set(false);
    }
  }

  async undo(): Promise<void> {
    if (!this.canUndo()) return;
    const snapshot = this.snapshots().at(-1);
    if (!snapshot) return;
    this.snapshots.update((snapshots) => snapshots.slice(0, -1));
    this.chatMessages.set(snapshot.messages);
    this.failure.set('');
    this.waiting.set(true);
    const revision = this.revision;
    try {
      await this.runSearch(
        snapshot.criteria,
        revision,
        'Angret siste endring. ',
      );
    } finally {
      if (revision === this.revision) this.waiting.set(false);
    }
  }

  newestFirst(): Promise<void> {
    return this.changeCriteria(
      (current) => copyCriteria(current, { sort: new SortOptions().dateDesc }),
      'Vis nyeste først',
    );
  }

  removeFilter(chip: SearchChatFilter): Promise<void> {
    return this.changeCriteria((current) => {
      switch (chip.type) {
        case 'query':
          return copyCriteria(current, { q: '' });
        case 'mediaType':
          return copyCriteria(current, { mediaType: 'alle' });
        case 'date':
          return copyCriteria(current, { date: new DateOptions().anytime });
        case 'sort':
          return copyCriteria(current, { sort: new SortOptions().relevance });
        case 'genre':
          return copyCriteria(current, { genre: new Genre() });
        case 'hint':
          return copyCriteria(current, {
            filters: current.filters.filter((f) => f.value !== chip.value),
          });
      }
    }, `Fjern avgrensningen «${chip.label}»`);
  }

  reset(): void {
    this.revision++;
    this.cancelled.next();
    this.snapshots.set([]);
    this.chatMessages.set([]);
    this.waiting.set(false);
    this.failure.set('');
  }

  private remember(criteria: Criteria, messages: SearchChatMessage[]): void {
    this.snapshots.update((snapshots) =>
      [...snapshots, { criteria: copyCriteria(criteria), messages }].slice(-20),
    );
  }

  private append(role: SearchChatMessage['role'], text: string): void {
    this.chatMessages.update((messages) =>
      [...messages, { role, text }].slice(-20),
    );
  }

  private async changeCriteria(
    change: (current: Criteria) => Criteria,
    message: string,
  ): Promise<void> {
    if (this.pending()) return;
    this.waiting.set(true);
    this.failure.set('');
    const revision = this.revision;
    try {
      const current = await firstValueFrom(this.search.getCriteria$);
      if (revision !== this.revision) return;
      this.remember(current, this.messages());
      this.append('user', message);
      await this.runSearch(change(current), revision);
    } finally {
      if (revision === this.revision) this.waiting.set(false);
    }
  }

  private async resolveFilters(
    criteria: Criteria,
    previous: Criteria,
  ): Promise<{ criteria?: Criteria; clarification?: string }> {
    const filters: Hint[] = [];
    for (const hint of criteria.filters) {
      const type = filterIs(hint, 'place')
        ? 'place'
        : filterIs(hint, 'creator')
        ? 'creator'
        : undefined;
      if (!type || previous.filters.some((f) => f.value === hint.value)) {
        filters.push(hint);
        continue;
      }
      const request = { q: hint.label, mediaType: criteria.mediaType, size: 3 };
      const candidates = await firstValueFrom(
        (type === 'place'
          ? this.typeahead.places(request)
          : this.typeahead.creators(request)
        ).pipe(timeout({ first: 15000 })),
      );
      const personName = (name: string) =>
        normaliseName(name)
          .split(/[^\p{L}\p{N}]+/u)
          .filter(Boolean)
          .sort()
          .join(' ');
      const exact = candidates.filter((candidate) =>
        type === 'creator'
          ? personName(candidate.label) === personName(hint.label)
          : normaliseName(candidate.label) === normaliseName(hint.label),
      );
      // Geography suggestions contain paths such as Norge;Oslo;Oslo;Bygdøy.
      // A city refinement should include its districts, rather than pick one path.
      if (
        type === 'place' &&
        !exact.length &&
        candidates.some((candidate) =>
          candidate.label
            .split(';')
            .some((part) => normaliseName(part) === normaliseName(hint.label)),
        )
      ) {
        filters.push(hint);
        continue;
      }
      if (exact.length !== 1) {
        const kind = type === 'place' ? 'sted' : 'fotograf/opphavsperson';
        return {
          clarification: candidates.length
            ? `Hvilken ${kind} mener du med «${
                hint.label
              }»? Katalogen foreslår: ${candidates
                .map((c) => c.label)
                .join('; ')}. Skriv navnet slik det står i listen.`
            : `Fant ikke «${hint.label}» som ${kind} i katalogen. Kan du bruke et annet eller mer fullstendig navn?`,
        };
      }
      filters.push(exact[0]);
    }
    return { criteria: copyCriteria(criteria, { filters }) };
  }

  /** Match replies to this request, never to an aggregation or a newer manual search. */
  private async runSearch(
    criteria: Criteria,
    revision: number,
    prefix = '',
  ): Promise<void> {
    this.progress.set('Søker i katalogen …');
    this.search.setCriteria(criteria);
    const applied = await firstValueFrom(this.search.getCriteria$);
    if (revision !== this.revision) return;
    const requestId = `chat-${++this.requestNumber}`;
    const completion = firstValueFrom(
      merge(
        this.actions.pipe(
          ofType<SearchSuccess | SearchError>(
            SearchActionTypes.SearchSuccess,
            SearchActionTypes.SearchError,
          ),
          filter((action) => action.requestId === requestId),
        ),
        this.actions.pipe(
          ofType<Search>(SearchActionTypes.Search),
          filter((action) => action.requestId !== requestId),
          map(() => null),
        ),
        this.actions.pipe(
          ofType(SearchActionTypes.ClearAll),
          map(() => null),
        ),
        this.cancelled.pipe(map(() => null)),
      ).pipe(take(1), timeout({ first: 45000 })),
    );
    this.search.search(requestId);
    try {
      const response = await completion;
      if (!response || revision !== this.revision) return;
      if ((await firstValueFrom(this.search.getCriteria$)) !== applied) return;
      if (response instanceof SearchError) {
        this.append(
          'assistant',
          `${prefix}Søket er oppdatert, men katalogen kunne ikke hente treffene. Du kan angre endringen.`,
        );
      } else {
        const count = response.payload.totalElements;
        if (!Number.isFinite(count) || count < 0)
          throw new Error('Invalid catalogue result count');
        this.append(
          'assistant',
          `${prefix}Fant ${new Intl.NumberFormat('nb-NO').format(
            count,
          )} treff. ${describeSearch(criteria)}.`,
        );
      }
    } catch (error) {
      if (revision !== this.revision) return;
      console.error('Could not load chat search results', error);
      this.append(
        'assistant',
        `${prefix}Søket er oppdatert, men treffantallet kunne ikke hentes. Du kan angre endringen.`,
      );
    }
  }
}
