import { inject, Injectable, InjectionToken } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import type { GenerativeModel } from 'firebase/ai';
import type { AppCheck } from 'firebase/app-check';
import { firstValueFrom, forkJoin, Observable, of } from 'rxjs';
import { filter, map, switchMap, take, timeout } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthFacade } from '../../+state/auth/auth.facade';
import { buildCatalogueFilters, SearchService } from './search.service';
import {
  Criteria,
  DateOption,
  DateOptions,
  Genre,
  Hint,
  Item,
  MediaTypeResults,
  SuperSearchResult,
  SortOptions,
  User,
} from '../models';
import { TypeaheadService } from './typeahead.service';

export interface SearchChatMessage {
  role: 'user' | 'assistant';
  text: string;
  resultGroups?: readonly SearchChatResultGroup[];
  total?: number;
}

export interface SearchChatResultGroup extends MediaTypeResults {
  label: string;
}

export const CHAT_RESULTS_PER_MEDIA_TYPE = 4;
export const MAX_CHAT_RESULTS_PER_MEDIA_TYPE = 100;

const mediaLabels: Record<string, string> = {
  bøker: 'Bøker',
  aviser: 'Aviser',
  bilder: 'Bilder',
  tidsskrift: 'Tidsskrift',
  kart: 'Kart',
  noter: 'Noter',
  musikkmanuskripter: 'Musikkmanuskripter',
  plakater: 'Plakater',
  privatarkivmateriale: 'Privatarkivmateriale',
  programrapporter: 'Programrapporter',
  andre: 'Andre medier',
  other: 'Andre medier',
};

function chatResultGroups(result: SuperSearchResult) {
  return [
    result.books,
    result.newspapers,
    result.photos,
    result.periodicals,
    result.maps,
    result.musicBooks,
    result.musicManuscripts,
    result.posters,
    result.privateArchives,
    result.programReports,
    result.others,
  ];
}

/** Each answer owns an independent, bounded snapshot for each carousel. */
export function getChatResultGroups(
  result: SuperSearchResult,
  mediaOrder: readonly string[] = [],
  resultLimit = CHAT_RESULTS_PER_MEDIA_TYPE,
): SearchChatResultGroup[] {
  const rank = (mediaType: string | null | undefined) => {
    const index = mediaOrder.indexOf(mediaType ?? 'andre');
    return index < 0 ? mediaOrder.length : index;
  };
  return chatResultGroups(result)
    .sort((a, b) => rank(a.mediaType) - rank(b.mediaType))
    .filter((source) => source.items.length > 0)
    .map((source) => {
      const seen = new Set<string>();
      const items: Item[] = [];
      for (const item of source.items) {
        const key = item.id ?? item.urn;
        if (key && seen.has(key)) continue;
        if (key) seen.add(key);
        items.push({ ...item });
        if (items.length === resultLimit) break;
      }
      return Object.assign(new MediaTypeResults(), source, {
        mediaType: source.mediaType ?? 'andre',
        items,
        label: mediaLabels[source.mediaType ?? 'andre'] ?? 'Andre medier',
      });
    });
}

export interface SearchChatFilter {
  type: 'query' | 'mediaType' | 'date' | 'sort' | 'genre' | 'hint';
  label: string;
  value?: string;
}

/** The classic catalogue keeps its single-media criteria unchanged. */
export interface ChatSearchCriteria extends Criteria {
  mediaTypes?: readonly string[];
  resultLimit?: number;
  resultLimitExplicit?: boolean;
  defaultResultLimit?: number;
}

export function getChatMediaTypes(
  criteria: ChatSearchCriteria,
): readonly string[] {
  return criteria.mediaTypes ?? [criteria.mediaType];
}

export function copyCriteria(
  criteria: ChatSearchCriteria,
  changes: NonNullable<ConstructorParameters<typeof Criteria>[0]> & {
    mediaTypes?: readonly string[];
    resultLimit?: number;
    resultLimitExplicit?: boolean;
    defaultResultLimit?: number;
  } = {},
): ChatSearchCriteria {
  const selected =
    changes.mediaTypes ??
    (changes.mediaType ? [changes.mediaType] : getChatMediaTypes(criteria));
  return Object.assign(
    new Criteria({
      q: criteria.q,
      date: criteria.date,
      sort: criteria.sort,
      genre: criteria.genre,
      filters: [...criteria.filters],
      ...changes,
      mediaType: selected.length === 1 ? selected[0] : 'alle',
    }),
    {
      mediaTypes: [...selected],
      resultLimit:
        changes.resultLimit ??
        criteria.resultLimit ??
        CHAT_RESULTS_PER_MEDIA_TYPE,
      resultLimitExplicit:
        changes.resultLimitExplicit ?? criteria.resultLimitExplicit ?? false,
      defaultResultLimit:
        changes.defaultResultLimit ??
        criteria.defaultResultLimit ??
        CHAT_RESULTS_PER_MEDIA_TYPE,
    },
  );
}

const catalogueFields = {
  place: 'subjectgeographic',
  creator: 'namecreators',
} as const;
const filterIs = (hint: Hint, type: keyof typeof catalogueFields) =>
  hint.value.startsWith(`${catalogueFields[type]}:`);
const normaliseName = (name: string) =>
  name.normalize('NFKC').trim().toLocaleLowerCase('nb-NO');

export function describeSearch(criteria: ChatSearchCriteria): string {
  return [
    criteria.q ? `«${criteria.q}»` : 'alle emner',
    getChatMediaTypes(criteria)
      .map((type) => (type === 'alle' ? 'alle medietyper' : type))
      .join(' og '),
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
  current: ChatSearchCriteria,
): {
  criteria?: ChatSearchCriteria;
  clarification?: string;
  more?: readonly string[];
} {
  if (!value || typeof value !== 'object')
    throw new Error('Invalid search plan');
  const plan = value as Record<string, unknown>;
  if (plan['action'] === 'more') {
    const selected = plan['mediaTypes'];
    if (
      !Array.isArray(selected) ||
      !selected.length ||
      !selected.every(
        (type) => typeof type === 'string' && mediaTypes.includes(type),
      ) ||
      (selected.includes('alle') && selected.length !== 1)
    ) {
      throw new Error('Invalid pagination request');
    }
    return { more: [...new Set(selected)] };
  }
  if (plan['action'] === 'clarify') {
    if (typeof plan['message'] !== 'string' || !plan['message'].trim()) {
      throw new Error('Missing clarification');
    }
    return { clarification: plan['message'].slice(0, 600) };
  }
  const {
    q,
    mediaTypes: selected,
    resultLimit,
    fromYear,
    toYear,
    sort,
    reset,
    places,
    creators,
  } = plan;
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
    !Array.isArray(selected) ||
    selected.length === 0 ||
    selected.length > mediaTypes.length ||
    !selected.every(
      (type) => typeof type === 'string' && mediaTypes.includes(type),
    ) ||
    (selected.includes('alle') && selected.length !== 1) ||
    !validYear(fromYear) ||
    !validYear(toYear) ||
    (fromYear !== null && toYear !== null && fromYear > toYear) ||
    !sortOption ||
    (resultLimit !== null &&
      (typeof resultLimit !== 'number' ||
        !Number.isInteger(resultLimit) ||
        resultLimit < 1 ||
        resultLimit > MAX_CHAT_RESULTS_PER_MEDIA_TYPE)) ||
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
    criteria: copyCriteria(base, {
      filters,
      genre: base.genre,
      q: q.trim(),
      mediaTypes: [...new Set(selected)],
      resultLimit:
        resultLimit ??
        current.defaultResultLimit ??
        CHAT_RESULTS_PER_MEDIA_TYPE,
      resultLimitExplicit: resultLimit !== null,
      date,
      sort: sortOption,
    }),
  };
}

type SearchPlanGenerator = (
  message: string,
  criteria: ChatSearchCriteria,
  history: SearchChatMessage[],
  signal?: AbortSignal,
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
      return async (message, criteria, history, signal) => {
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
Follow-ups preserve subject, ALL selected media types, dates and sort unless explicitly changed. Never use conversation history to restore filters the user removed manually.
Translate ordinary English subjects to Norwegian catalogue keywords (dogs -> hunder), preserving names and explicit quoted phrases.
mediaTypes is the complete ordered list of selected media types, combined as OR alternatives.
When the user lists media types, keep their order of mention: "bilder og bøker" -> ["bilder","bøker"], "bøker og bilder" -> ["bøker","bilder"]. An explicit request such as "bilder først" reorders the current selection without removing types.
Follow-ups preserve the existing mediaTypes order unless explicitly reordered. Append newly added types to the end; removing a type preserves the order of the remaining types.
Images/photos/bilder means ["bilder"]. "Bilder og bøker" means ["bilder","bøker"]. All media types means ["alle"], never combined with other types.
"Ta også med kart" adds kart to the current selection. "Bare bøker" replaces it with ["bøker"]. "Uten bilder" removes bilder; if nothing remains, ask for clarification.
Always return the full mediaTypes selection, including for date, subject, place, creator or sort follow-ups.
After year 2000 means fromYear 2001; before 2000 means toYear 1999. Since/from 2000 includes 2000.
Null year means no bound; remove the date restriction means both years null.
reset=true only for an explicit request to start a new search or clear all filters; use defaults for unspecified fields then.
resultLimit is null for automatic sizing, or an integer from 1 to ${MAX_CHAT_RESULTS_PER_MEDIA_TYPE} ONLY when the user explicitly requests a count. With null, the browser supplies defaultResultLimit to fit two rows. Never invent a default count such as 20.
Preserve an explicit resultLimit on follow-ups unless the user changes it; use null for a new search without a requested count. An explicit count must be fetched and displayed in full, never visually truncated.
"Jeg vil se 40 treff av fugler i bøker" sets q="fugler", mediaTypes=["bøker"], resultLimit=40. "Vis 40 treff" changes only resultLimit. A requested count belongs in resultLimit, never q. If the requested count is outside the supported range, clarify the supported limit; never silently reduce it.
Supported changes: subject q, mediaTypes, resultLimit, whole-year date bounds, sort, places and creators (photographer/author).
places and creators are optional arrays of names, NOT filter syntax. Omit them when unchanged. If changing one category, return ALL desired names in that category; [] removes that category. Existing other filters are preserved unless reset=true.
Multiple names within a category are AND restrictions. If the user requests OR alternatives between names, clarify that one location/person at a time is supported.
"Bare fra Oslo" sets places=["Oslo"], preserving the subject and all other criteria. "Fotografert av Anders Beer Wilse" sets creators=["Anders Beer Wilse"]. Do not repeat place or creator names in q when they belong in a filter. Never invent a person's name or silently choose among ambiguous catalogue candidates.
For unsupported changes, ambiguous requests or questions unrelated to catalogue search, use action clarify and a short question/explanation in the user's language. Do not claim to have found images, generated images or inspected their contents.
q contains only catalogue search terms, never the full chat request. No raw catalogue filter expressions.
For requests to load more existing matches ("flere", "vis flere", "neste side"), use action more with mediaTypes=["alle"]. For "flere bilder", use action more with mediaTypes=["bilder"]. Do not change the search criteria or resultLimit to paginate. If the request includes new subject/date/filter changes, use action search instead.
For action search or more, message is empty. For clarify, retain current criteria and explain in message.`,
              generationConfig: {
                responseMimeType: 'application/json',
                thinkingConfig: { thinkingLevel: environment.ai.thinkingLevel },
                maxOutputTokens: 2048,
                responseSchema: Schema.object({
                  properties: {
                    action: Schema.enumString({
                      enum: ['search', 'clarify', 'more'],
                    }),
                    message: Schema.string(),
                    q: Schema.string(),
                    mediaTypes: Schema.array({
                      items: Schema.enumString({ enum: mediaTypes }),
                    }),
                    resultLimit: Schema.integer({ nullable: true }),
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
                mediaTypes: getChatMediaTypes(criteria),
                resultLimit: criteria.resultLimitExplicit
                  ? criteria.resultLimit
                  : null,
                defaultResultLimit:
                  criteria.defaultResultLimit ?? CHAT_RESULTS_PER_MEDIA_TYPE,
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
              recentConversation: history
                .slice(-8)
                .map(({ role, text }) => ({ role, text })),
              message,
            }),
            { signal },
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
  private readonly generate = inject(SEARCH_PLAN_GENERATOR);
  private readonly typeahead = inject(TypeaheadService);
  private readonly catalogue = inject(SearchService);
  private readonly auth = inject(AuthFacade);

  async interpret(
    message: string,
    criteria: ChatSearchCriteria,
    history: SearchChatMessage[],
    signal?: AbortSignal,
  ): Promise<{
    criteria?: ChatSearchCriteria;
    clarification?: string;
    more?: readonly string[];
  }> {
    const plan = await this.generate(message, criteria, history, signal);
    if (signal?.aborted)
      throw new DOMException('Chat request cancelled', 'AbortError');
    const result = applyChatSearchPlan(plan, criteria);
    return result;
  }

  search(criteria: ChatSearchCriteria): Observable<SuperSearchResult> {
    return this.auth.currentUser$.pipe(
      filter((user): user is User => user != null),
      take(1),
      switchMap((user) => {
        const query = {
          q: criteria.q,
          mediaType: criteria.mediaType,
          sort: criteria.sort,
          size: criteria.resultLimit ?? CHAT_RESULTS_PER_MEDIA_TYPE,
          filters: buildCatalogueFilters(criteria, user),
        };
        const selected = getChatMediaTypes(criteria);
        if (selected.includes('alle')) return this.catalogue.super(query);
        if (selected.length === 1) {
          return this.catalogue.search({ ...query, mediaType: selected[0] });
        }
        return forkJoin(
          selected.map((mediaType) =>
            this.catalogue.search({ ...query, mediaType }),
          ),
        ).pipe(
          map((results) => {
            const combined = new SuperSearchResult();
            combined.totalElements = results.reduce(
              (total, result) => total + result.totalElements,
              0,
            );
            for (const group of chatResultGroups(combined)) {
              const index = selected.indexOf(group.mediaType ?? '');
              if (index < 0) continue;
              const source = chatResultGroups(results[index]).find(
                (candidate) => candidate.mediaType === group.mediaType,
              );
              if (source)
                Object.assign(group, source, { items: [...source.items] });
            }
            return combined;
          }),
        );
      }),
    );
  }

  loadMore(
    groups: readonly SearchChatResultGroup[],
    selected: readonly string[] = ['alle'],
  ): Observable<SearchChatResultGroup[]> {
    const pending = groups.filter(
      (group) =>
        group.nextLink &&
        (selected.includes('alle') || selected.includes(group.mediaType ?? '')),
    );
    if (!pending.length) return of([...groups]);
    return this.auth.currentUser$.pipe(
      filter((user): user is User => user != null),
      take(1),
      switchMap(() =>
        forkJoin(
          pending.map((group) => {
            // Only follow catalogue pagination links, never arbitrary model URLs.
            const base = new URL(environment.nb.apiURL);
            const url = new URL(group.nextLink ?? '', base);
            if (
              url.origin !== base.origin ||
              url.pathname !== '/catalog/v1/items' ||
              url.username ||
              url.password
            ) {
              throw new Error('Invalid catalogue pagination link');
            }
            const type = ['other', 'andre'].includes(group.mediaType ?? '')
              ? 'others'
              : group.mediaType ?? '';
            return this.catalogue.searchByUrl(type, url.href).pipe(
              map((result) => {
                const page = chatResultGroups(result).find(
                  (candidate) => candidate.mediaType === type,
                );
                if (!page) throw new Error('Missing catalogue page');
                const seen = new Set<string>();
                const items = [...group.items, ...page.items]
                  .filter((item) => {
                    const key = item.id ?? item.urn;
                    if (!key) return true;
                    if (seen.has(key)) return false;
                    seen.add(key);
                    return true;
                  })
                  .map((item) => ({ ...item }));
                return Object.assign(new MediaTypeResults(), group, {
                  items,
                  nextLink:
                    page.nextLink === group.nextLink ? null : page.nextLink,
                });
              }),
            );
          }),
        ),
      ),
      map((pages) =>
        groups.map((group) => {
          const index = pending.indexOf(group);
          return index < 0
            ? group
            : Object.assign({}, pages[index], { label: group.label });
        }),
      ),
    );
  }

  async resolveFilters(
    criteria: ChatSearchCriteria,
    previous: ChatSearchCriteria,
  ): Promise<{ criteria?: ChatSearchCriteria; clarification?: string }> {
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
}
