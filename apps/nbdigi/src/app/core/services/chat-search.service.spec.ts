import { TestBed } from '@angular/core/testing';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { Actions } from '@ngrx/effects';
import { SearchFacade } from '../../+state/search/search.facade';
import { Criteria, DateOption, Hint, SuperSearchResult } from '../models';
import {
  Search,
  SearchSuccess,
  SearchError,
  ClearAll,
} from '../../+state/search/search.actions';
import { TypeaheadService } from './typeahead.service';
import { QueryBuilder } from '../builders/query-builder';
import {
  applyChatSearchPlan,
  ChatSearchService,
  SEARCH_PLAN_GENERATOR,
  ChatSearchRequestError,
  verifyChatAppCheck,
} from './chat-search.service';

const dogImages = {
  action: 'search',
  message: '',
  q: 'hunder',
  mediaType: 'bilder',
  fromYear: null,
  toYear: null,
  sort: '_score,desc',
  reset: false,
};

describe('chat App Check verification', () => {
  afterEach(() => jest.useRealTimers());

  it('reports authentication failures separately from model failures', async () => {
    const cause = new Error('App Check token rejected');
    await expect(
      verifyChatAppCheck(() => Promise.reject(cause)),
    ).rejects.toMatchObject({
      stage: 'app-check',
      timedOut: false,
      cause,
    });
  });

  it('stops waiting when App Check never returns', async () => {
    jest.useFakeTimers();
    const request = verifyChatAppCheck(() => new Promise(() => undefined));
    const assertion = expect(request).rejects.toMatchObject({
      stage: 'app-check',
      timedOut: true,
    });
    await jest.advanceTimersByTimeAsync(20000);
    await assertion;
    expect(jest.getTimerCount()).toBe(0);
  });

  it('clears the timeout after verification succeeds', async () => {
    jest.useFakeTimers();
    await verifyChatAppCheck(() => Promise.resolve());
    expect(jest.getTimerCount()).toBe(0);
  });
});

describe('chat search criteria', () => {
  it('keeps the subject, media type and existing filters when adding a year bound', () => {
    const current = new Criteria({
      q: 'hunder',
      mediaType: 'bilder',
      filters: [new Hint({ label: 'Oslo', value: 'place:Oslo' })],
    });
    const { criteria } = applyChatSearchPlan(
      { ...dogImages, fromYear: 2001 },
      current,
    );
    expect(criteria?.q).toBe('hunder');
    expect(criteria?.mediaType).toBe('bilder');
    expect(criteria?.filters).toEqual(current.filters);
    expect(criteria?.date.value).toBe('date:[20010101 TO 49991231]');
  });

  it('removes a date restriction without removing the subject', () => {
    const dated = applyChatSearchPlan(
      { ...dogImages, fromYear: 2001 },
      new Criteria(),
    ).criteria!;
    const { criteria } = applyChatSearchPlan(dogImages, dated);
    expect(criteria?.q).toBe('hunder');
    expect(criteria?.date.value).toBeNull();
  });

  it('preserves exact manually selected dates when the model leaves the years unchanged', () => {
    const current = new Criteria({
      date: new DateOption({
        fromDate: '20010512',
        toDate: '20020913',
        value: 'date:[20010512 TO 20020913]',
      }),
    });
    const { criteria } = applyChatSearchPlan(
      { ...dogImages, fromYear: 2001, toYear: 2002 },
      current,
    );
    expect(criteria?.date).toBe(current.date);
  });

  it('clears previous filters only for an explicit reset', () => {
    const current = new Criteria({ filters: [new Hint({ label: 'Oslo' })] });
    expect(
      applyChatSearchPlan({ ...dogImages, reset: true }, current).criteria
        ?.filters,
    ).toEqual([]);
  });

  it.each([
    { fromYear: 2001, toYear: 1900 },
    { fromYear: 2000.5 },
    { fromYear: '2000' },
    { fromYear: 0 },
    { toYear: 5000 },
    { mediaType: 'invented' },
    { sort: 'invented' },
    { action: 'unknown' },
    { reset: 'true' },
    { q: 'a'.repeat(501) },
    { places: 'Oslo' },
    { places: [''] },
    { creators: [42] },
    { creators: ['a'.repeat(201)] },
    { places: ['a', 'b', 'c', 'd', 'e', 'f'] },
  ])('rejects invalid model output: %j', (invalid) => {
    expect(() =>
      applyChatSearchPlan({ ...dogImages, ...invalid }, new Criteria()),
    ).toThrow();
  });

  it('asks for clarification without changing search criteria', () => {
    const result = applyChatSearchPlan(
      { action: 'clarify', message: 'Hvilket år mener du?' },
      new Criteria(),
    );
    expect(result.criteria).toBeUndefined();
    expect(result.clarification).toBe('Hvilket år mener du?');
  });

  it('encodes search terms so an ampersand cannot add catalogue filters', () => {
    const query = new QueryBuilder()
      .withQ('hunder &filter=mediatype:bøker')
      .build();
    const params = new URLSearchParams(query);
    expect(params.get('q')).toBe('hunder &filter=mediatype:bøker');
    expect(params.getAll('filter')).toEqual([]);
  });

  it('adds quoted place and creator filters while preserving unrelated restrictions', () => {
    const current = new Criteria({
      filters: [new Hint({ value: 'language:nor', label: 'Norsk' })],
    });
    const result = applyChatSearchPlan(
      { ...dogImages, places: ['Oslo'], creators: ['Wilse, Anders Beer'] },
      current,
    ).criteria!;
    expect(result.filters.map((f) => f.value)).toEqual([
      'language:nor',
      'subjectgeographic:"Oslo"',
      'namecreators:"Wilse, Anders Beer"',
    ]);
    expect(current.filters).toHaveLength(1);
  });

  it('removes only the requested filter category', () => {
    const current = applyChatSearchPlan(
      { ...dogImages, places: ['Oslo'], creators: ['Wilse'] },
      new Criteria(),
    ).criteria!;
    const result = applyChatSearchPlan({ ...dogImages, places: [] }, current)
      .criteria!;
    expect(result.filters.map((f) => f.value)).toEqual([
      'namecreators:"Wilse"',
    ]);
  });
});

describe('ChatSearchService', () => {
  let service: ChatSearchService;
  let criteria$: BehaviorSubject<Criteria>;
  let generate: jest.Mock;
  let actions: Subject<Search | SearchSuccess | SearchError | ClearAll>;
  let typeahead: { places: jest.Mock; creators: jest.Mock };
  let search: {
    getCriteria$: BehaviorSubject<Criteria>;
    setCriteria: jest.Mock;
    search: jest.Mock;
  };

  beforeEach(() => {
    criteria$ = new BehaviorSubject(new Criteria());
    generate = jest.fn().mockResolvedValue(dogImages);
    actions = new Subject();
    typeahead = {
      places: jest.fn(({ q }) =>
        of([
          new Hint({
            type: 'place',
            label: q,
            value: `subjectgeographic:"${q}"`,
          }),
        ]),
      ),
      creators: jest.fn(({ q }) =>
        of([
          new Hint({ type: 'person', label: q, value: `namecreators:"${q}"` }),
        ]),
      ),
    };
    search = {
      getCriteria$: criteria$,
      setCriteria: jest.fn((criteria) => criteria$.next(criteria)),
      search: jest.fn((requestId) => {
        actions.next(new Search(requestId));
        const result = new SuperSearchResult();
        result.totalElements = 42;
        actions.next(new SearchSuccess(result, requestId));
      }),
    };
    TestBed.configureTestingModule({
      providers: [
        { provide: SearchFacade, useValue: search },
        { provide: SEARCH_PLAN_GENERATOR, useValue: generate },
        { provide: Actions, useValue: new Actions(actions) },
        { provide: TypeaheadService, useValue: typeahead },
      ],
    });
    service = TestBed.inject(ChatSearchService);
  });

  it('searches dog images then sends the active criteria with the follow-up', async () => {
    await service.send('Show images with dogs');
    generate.mockResolvedValue({ ...dogImages, fromYear: 2001 });
    await service.send('Only after 2000');
    expect(generate.mock.calls[1][1]).toMatchObject({
      q: 'hunder',
      mediaType: 'bilder',
    });
    expect(criteria$.value.date.fromDate).toBe('20010101');
    expect(search.search).toHaveBeenCalledTimes(2);
    expect(service.messages()).toHaveLength(4);
    expect(service.pending()).toBe(false);
    expect(service.messages().at(-1)?.text).toContain('Fant 42 treff');
  });

  it('undoes the last refinement and restores the earlier conversation and criteria', async () => {
    await service.send('Bilder av hunder');
    generate.mockResolvedValue({ ...dogImages, fromYear: 2001 });
    await service.send('Bare etter 2000');
    await service.undo();
    expect(criteria$.value).toMatchObject({ q: 'hunder', mediaType: 'bilder' });
    expect(criteria$.value.date.value).toBeNull();
    expect(service.messages().some((m) => m.text === 'Bare etter 2000')).toBe(
      false,
    );
    expect(service.messages().at(-1)?.text).toContain(
      'Angret siste endring. Fant 42 treff',
    );
    expect(generate).toHaveBeenCalledTimes(2);
    await service.undo();
    expect(criteria$.value.q).toBe('');
    expect(service.canUndo()).toBe(false);
  });

  it('removes a date chip without calling Gemini and can undo the removal', async () => {
    generate.mockResolvedValue({ ...dogImages, fromYear: 2001 });
    await service.send('Bilder av hunder etter 2000');
    await service.removeFilter({ type: 'date', label: 'Fra 2001' });
    expect(criteria$.value.q).toBe('hunder');
    expect(criteria$.value.date.value).toBeNull();
    expect(generate).toHaveBeenCalledTimes(1);
    await service.undo();
    expect(criteria$.value.date.fromDate).toBe('20010101');
  });

  it('clears the subject when its chip is removed, retaining other criteria', async () => {
    await service.send('Bilder av hunder');
    await service.removeFilter({ type: 'query', label: 'hunder' });
    expect(criteria$.value.q).toBe('');
    expect(criteria$.value.mediaType).toBe('bilder');
  });

  it('sorts newest first directly without changing the subject or making another AI call', async () => {
    await service.send('Bilder av hunder');
    await service.newestFirst();
    expect(criteria$.value).toMatchObject({
      q: 'hunder',
      mediaType: 'bilder',
      sort: { value: 'date,desc' },
    });
    expect(generate).toHaveBeenCalledTimes(1);
  });

  it('resolves place and photographer names through catalogue suggestions', async () => {
    generate.mockResolvedValue({
      ...dogImages,
      places: ['Oslo'],
      creators: ['Wilse, Anders Beer'],
    });
    await service.send('Bilder av hunder fra Oslo fotografert av Wilse');
    expect(typeahead.places).toHaveBeenCalledWith(
      expect.objectContaining({ q: 'Oslo', mediaType: 'bilder' }),
    );
    expect(typeahead.creators).toHaveBeenCalledWith(
      expect.objectContaining({ q: 'Wilse, Anders Beer' }),
    );
    expect(criteria$.value.filters.map((f) => f.value)).toEqual([
      'subjectgeographic:"Oslo"',
      'namecreators:"Wilse, Anders Beer"',
    ]);
    generate.mockResolvedValue({ ...dogImages, fromYear: 2001 });
    await service.send('Etter 2000');
    expect(criteria$.value.filters).toHaveLength(2);
    expect(typeahead.places).toHaveBeenCalledTimes(1);
  });

  it('asks which photographer is intended without applying any partial criteria', async () => {
    generate.mockResolvedValue({ ...dogImages, creators: ['Olsen'] });
    typeahead.creators.mockReturnValue(
      of([
        new Hint({ label: 'Olsen, Per', value: 'namecreators:"Olsen, Per"' }),
        new Hint({ label: 'Olsen, Kari', value: 'namecreators:"Olsen, Kari"' }),
      ]),
    );
    await service.send('Fotografert av Olsen');
    expect(search.setCriteria).not.toHaveBeenCalled();
    expect(service.messages().at(-1)?.text).toContain(
      'Olsen, Per; Olsen, Kari',
    );
  });

  it('uses a city filter across all its catalogue districts', async () => {
    generate.mockResolvedValue({ ...dogImages, places: ['Oslo'] });
    typeahead.places.mockReturnValue(
      of([
        new Hint({
          label: 'Norge;Oslo;Oslo;Bygdøy',
          value: 'subjectgeographic:"Norge;Oslo;Oslo;Bygdøy"',
        }),
        new Hint({
          label: 'Norge;Oslo;Oslo;Abelhaugen;;;',
          value: 'subjectgeographic:"Norge;Oslo;Oslo;Abelhaugen;;;"',
        }),
      ]),
    );
    await service.send('Bare fra Oslo');
    expect(criteria$.value.filters[0].value).toBe('subjectgeographic:"Oslo"');
    expect(search.search).toHaveBeenCalledTimes(1);
  });

  it('matches full photographer names regardless of catalogue surname ordering', async () => {
    generate.mockResolvedValue({
      ...dogImages,
      creators: ['Anders Beer Wilse'],
    });
    typeahead.creators.mockReturnValue(
      of([
        new Hint({
          label: 'Wilse, Anders Beer',
          value: 'namecreators:"Wilse, Anders Beer"',
        }),
      ]),
    );
    await service.send('Fotografert av Anders Beer Wilse');
    expect(criteria$.value.filters[0].value).toBe(
      'namecreators:"Wilse, Anders Beer"',
    );
  });

  it('waits for the catalogue before reporting a count', async () => {
    let started!: () => void;
    const dispatched = new Promise<void>((resolve) => {
      started = resolve;
    });
    search.search.mockImplementation((requestId) => {
      actions.next(new Search(requestId));
      started();
    });
    const request = service.send('Bilder av hunder');
    await dispatched;
    expect(service.pending()).toBe(true);
    expect(service.pendingLabel()).toBe('Søker i katalogen …');
    expect(service.messages()).toHaveLength(1);
    const result = new SuperSearchResult();
    result.totalElements = 0;
    actions.next(new SearchSuccess(result, search.search.mock.calls[0][0]));
    await request;
    expect(service.messages().at(-1)?.text).toContain('Fant 0 treff');
  });

  it('drops a pending count when the user starts a different search', async () => {
    let started!: () => void;
    const dispatched = new Promise<void>((resolve) => {
      started = resolve;
    });
    search.search.mockImplementation((requestId) => {
      actions.next(new Search(requestId));
      started();
    });
    const request = service.send('Bilder av hunder');
    await dispatched;
    actions.next(new Search());
    await request;
    expect(service.pending()).toBe(false);
    expect(service.messages().some((m) => m.text.includes('Fant'))).toBe(false);
  });

  it('does not use an unrelated result count for the chat response', async () => {
    search.search.mockImplementation((requestId) => {
      const unrelated = new SuperSearchResult();
      unrelated.totalElements = 999;
      actions.next(new SearchSuccess(unrelated, 'other-search'));
      const actual = new SuperSearchResult();
      actual.totalElements = 7;
      actions.next(new SearchSuccess(actual, requestId));
    });
    await service.send('Bilder av hunder');
    expect(service.messages().at(-1)?.text).toContain('Fant 7 treff');
    expect(service.messages().at(-1)?.text).not.toContain('999');
  });

  it('reports catalogue failure without inventing a result count and allows undo', async () => {
    search.search.mockImplementation((requestId) =>
      actions.next(new SearchError(new Error('Offline'), requestId)),
    );
    await service.send('Bilder av hunder');
    expect(service.messages().at(-1)?.text).toContain('katalogen kunne ikke');
    expect(service.messages().at(-1)?.text).not.toContain('Fant');
    expect(service.canUndo()).toBe(true);
  });

  it('uses manual filter changes as the next request context', async () => {
    await service.send('Dogs');
    const manual = new Criteria({ q: 'katter', mediaType: 'bøker' });
    criteria$.next(manual);
    await service.send('After 2000');
    expect(generate.mock.calls[1][1]).toBe(manual);
  });

  it('does not overwrite manual changes made while AI is responding', async () => {
    let resolve!: (value: unknown) => void;
    generate.mockReturnValue(
      new Promise((done) => {
        resolve = done;
      }),
    );
    const log = jest
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    const request = service.send('Dogs');
    await Promise.resolve();
    criteria$.next(new Criteria({ q: 'katter' }));
    resolve(dogImages);
    await request;
    expect(search.setCriteria).not.toHaveBeenCalled();
    expect(criteria$.value.q).toBe('katter');
    expect(service.error()).toBeTruthy();
    log.mockRestore();
  });

  it('ignores an outstanding response after starting a new conversation', async () => {
    let resolve!: (value: unknown) => void;
    generate.mockReturnValue(
      new Promise((done) => {
        resolve = done;
      }),
    );
    const request = service.send('Dogs');
    await Promise.resolve();
    service.reset();
    resolve(dogImages);
    await request;
    expect(search.search).not.toHaveBeenCalled();
    expect(service.messages()).toEqual([]);
    expect(service.pending()).toBe(false);
  });

  it('keeps the current search available when the AI request fails', async () => {
    generate.mockRejectedValue(new Error('Quota exceeded'));
    const log = jest
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    await service.send('Dogs');
    expect(search.setCriteria).not.toHaveBeenCalled();
    expect(service.error()).toContain('Vanlig søk');
    expect(service.pending()).toBe(false);
    log.mockRestore();
  });

  it('does not search for a clarification', async () => {
    generate.mockResolvedValue({ action: 'clarify', message: 'Hvilket år?' });
    await service.send('After that year');
    expect(search.search).not.toHaveBeenCalled();
    expect(service.messages().at(-1)?.text).toBe('Hvilket år?');
  });

  it.each([
    [new ChatSearchRequestError('model', true), 'for lang tid'],
    [new ChatSearchRequestError('app-check', false), 'bekrefte tilkoblingen'],
  ])(
    'explains the failed stage without changing the search',
    async (error, message) => {
      generate.mockRejectedValue(error);
      const log = jest
        .spyOn(console, 'error')
        .mockImplementation(() => undefined);
      await service.send('Dogs');
      expect(service.error()).toContain(message);
      expect(search.setCriteria).not.toHaveBeenCalled();
      expect(service.pending()).toBe(false);
      log.mockRestore();
    },
  );
});
