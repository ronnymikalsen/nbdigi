import { TestBed } from '@angular/core/testing';
import { BehaviorSubject, of, Subject, throwError } from 'rxjs';
import { AiSearchStore } from './ai-search.store';
import { AuthFacade } from '../+state/auth/auth.facade';
import { SearchFacade } from '../+state/search/search.facade';
import { Criteria, Hint, Item, SuperSearchResult } from '../core/models';
import {
  ChatSearchRequestError,
  SEARCH_PLAN_GENERATOR,
} from '../core/services/chat-search.service';
import { SearchService } from '../core/services/search.service';
import { TypeaheadService } from '../core/services/typeahead.service';

const dogImages = {
  action: 'search',
  message: '',
  q: 'hunder',
  mediaTypes: ['bilder'],
  resultLimit: 20,
  fromYear: null,
  toYear: null,
  sort: '_score,desc',
  reset: false,
};

function results(count = 42, prefix = 'photo'): SuperSearchResult {
  const result = new SuperSearchResult();
  result.totalElements = count;
  result.photos.totalElements = count;
  result.photos.items = Array.from(
    { length: Math.min(count, 12) },
    (_, i) => new Item({ id: `${prefix}-${i}`, title: `Photo ${i}` }),
  );
  return result;
}

describe('AiSearchStore', () => {
  let store: InstanceType<typeof AiSearchStore>;
  let generate: jest.Mock;
  let catalogue: {
    search: jest.Mock;
    super: jest.Mock;
    searchByUrl: jest.Mock;
  };
  let typeahead: { places: jest.Mock; creators: jest.Mock };
  let classicCriteria: BehaviorSubject<Criteria>;
  let classic: {
    getCriteria$: BehaviorSubject<Criteria>;
    setCriteria: jest.Mock;
    search: jest.Mock;
    clearAll: jest.Mock;
  };

  beforeEach(() => {
    generate = jest.fn().mockResolvedValue(dogImages);
    catalogue = {
      search: jest.fn(() => of(results())),
      searchByUrl: jest.fn(() => of(results())),
      super: jest.fn(() => of(results())),
    };
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
    classicCriteria = new BehaviorSubject(
      new Criteria({ q: 'vanlig søk', mediaType: 'bøker' }),
    );
    classic = {
      getCriteria$: classicCriteria,
      setCriteria: jest.fn(),
      search: jest.fn(),
      clearAll: jest.fn(),
    };
    TestBed.configureTestingModule({
      providers: [
        { provide: SEARCH_PLAN_GENERATOR, useValue: generate },
        { provide: SearchService, useValue: catalogue },
        { provide: TypeaheadService, useValue: typeahead },
        {
          provide: AuthFacade,
          useValue: { currentUser$: of({ uid: 'regular-user' }) },
        },
        { provide: SearchFacade, useValue: classic },
      ],
    });
    store = TestBed.inject(AiSearchStore);
  });

  it('starts with fresh chat criteria and preserves follow-ups in its own state', async () => {
    expect(store.criteria().q).toBe('');
    await store.send('Bilder av hunder');
    generate.mockResolvedValue({ ...dogImages, fromYear: 2001 });
    await store.send('Bare etter 2000');
    expect(generate.mock.calls[1][1]).toMatchObject({
      q: 'hunder',
      mediaType: 'bilder',
    });
    expect(store.criteria().date.fromDate).toBe('20010101');
    expect(store.status()).toBe('ready');
    expect(store.messages()).toHaveLength(4);
    expect(store.messages().at(-1)?.text).toContain('Fant 42 treff');
    expect(catalogue.search.mock.calls[1][0]).toMatchObject({
      size: 20,
      q: 'hunder',
      filters: expect.arrayContaining([
        'date:[20010101 TO 49991231]',
        'digital:Ja',
        'contentClasses:jp2',
      ]),
    });
  });

  it('loads separate carousels for selected media types and keeps the selection through follow-ups and undo', async () => {
    const mixed = {
      ...dogImages,
      mediaTypes: ['bilder', 'bøker'],
      fromYear: 2001,
    };
    generate.mockResolvedValue(mixed);
    catalogue.search.mockImplementation(({ mediaType }) => {
      const result = new SuperSearchResult();
      result.totalElements = mediaType === 'bilder' ? 12 : 8;
      const group = mediaType === 'bilder' ? result.photos : result.books;
      group.totalElements = result.totalElements;
      group.items = Array.from(
        { length: 10 },
        (_, i) =>
          new Item({
            id: `${mediaType}-${i}`,
            mediaType,
          }),
      );
      return of(result);
    });
    await store.send('Bilder og bøker om hunder etter 2000');
    expect(catalogue.super).not.toHaveBeenCalled();
    expect(
      catalogue.search.mock.calls.map(([query]) => query.mediaType),
    ).toEqual(['bilder', 'bøker']);
    for (const [query] of catalogue.search.mock.calls) {
      expect(query.q).toBe('hunder');
      expect(query.filters).toContain('date:[20010101 TO 49991231]');
      expect(query.filters).toContain('contentClasses:jp2');
    }
    const answer = store.messages().at(-1);
    if (!answer) throw new Error('Missing mixed-media answer');
    expect(answer.total).toBe(20);
    expect(answer.text).toContain('bilder og bøker');
    expect(answer.resultGroups?.map((group) => group.mediaType)).toEqual([
      'bilder',
      'bøker',
    ]);
    expect(answer.resultGroups?.flatMap((group) => group.items)).toHaveLength(
      20,
    );
    expect(
      new Set(
        answer.resultGroups
          ?.flatMap((group) => group.items)
          ?.map((item) => item.mediaType),
      ),
    ).toEqual(new Set(['bilder', 'bøker']));
    await store.newestFirst();
    expect(store.criteria().mediaTypes).toEqual(['bilder', 'bøker']);
    expect(
      store
        .messages()
        .at(-1)
        ?.resultGroups?.map((group) => group.mediaType),
    ).toEqual(['bilder', 'bøker']);
    generate.mockResolvedValue({ ...mixed, mediaTypes: ['bøker'] });
    await store.send('Bare bøker');
    expect(generate.mock.calls.at(-1)[1].mediaTypes).toEqual([
      'bilder',
      'bøker',
    ]);
    expect(store.criteria().mediaTypes).toEqual(['bøker']);
    expect(catalogue.search.mock.calls.at(-1)[0].mediaType).toBe('bøker');
    await store.undo();
    expect(store.criteria().mediaTypes).toEqual(['bilder', 'bøker']);
    expect(store.criteria().date.fromDate).toBe('20010101');
    expect(store.messages()[1]).toBe(answer);
    expect(
      store
        .messages()
        .at(-1)
        ?.resultGroups?.map((group) => group.mediaType),
    ).toEqual(['bilder', 'bøker']);
    store.reset();
    expect(store.criteria().mediaTypes).toEqual(['alle']);
  });

  it('includes maps and posters and replaces a selection with all media', async () => {
    generate.mockResolvedValue({
      ...dogImages,
      mediaTypes: ['kart', 'plakater'],
    });
    catalogue.search.mockImplementation(({ mediaType }) => {
      const result = new SuperSearchResult();
      result.totalElements = 1;
      const group = mediaType === 'kart' ? result.maps : result.posters;
      group.totalElements = result.totalElements;
      group.items = [new Item({ id: mediaType, mediaType })];
      return of(result);
    });
    await store.send('Kart og plakater');
    expect(
      store
        .messages()
        .at(-1)
        ?.resultGroups?.flatMap((group) => group.items)
        .map((item) => item.mediaType),
    ).toEqual(['kart', 'plakater']);
    generate.mockResolvedValue({ ...dogImages, mediaTypes: ['alle'] });
    await store.send('Alle medietyper');
    expect(catalogue.super).toHaveBeenCalledTimes(1);
    expect(store.criteria().mediaTypes).toEqual(['alle']);
  });

  it('fetches and displays forty requested book results and preserves the count through follow-ups and undo', async () => {
    const plan = {
      ...dogImages,
      q: 'fugler',
      mediaTypes: ['bøker'],
      resultLimit: 40,
    };
    generate.mockResolvedValue(plan);
    catalogue.search.mockImplementation(({ size }) => {
      const response = new SuperSearchResult();
      response.totalElements = 125;
      response.books.totalElements = 125;
      response.books.items = Array.from(
        { length: size },
        (_, i) => new Item({ id: `book-${i}` }),
      );
      return of(response);
    });
    await store.send('Jeg vil se 40 treff av fugler i bøker');
    expect(catalogue.search).toHaveBeenLastCalledWith(
      expect.objectContaining({ q: 'fugler', mediaType: 'bøker', size: 40 }),
    );
    const firstAnswer = store.messages().at(-1);
    expect(firstAnswer?.resultGroups?.[0].items).toHaveLength(40);
    expect(firstAnswer?.total).toBe(125);
    generate.mockResolvedValue({ ...plan, fromYear: 2001 });
    await store.send('Bare etter 2000');
    expect(generate.mock.calls.at(-1)[1].resultLimit).toBe(40);
    expect(store.criteria().resultLimit).toBe(40);
    await store.newestFirst();
    expect(catalogue.search.mock.calls.at(-1)[0].size).toBe(40);
    generate.mockResolvedValue({ ...plan, fromYear: 2001, resultLimit: 10 });
    await store.send('Vis bare 10 treff');
    expect(store.messages().at(-1)?.resultGroups?.[0].items).toHaveLength(10);
    expect(firstAnswer?.resultGroups?.[0].items).toHaveLength(40);
    await store.undo();
    expect(store.criteria().resultLimit).toBe(40);
    expect(store.messages().at(-1)?.resultGroups?.[0].items).toHaveLength(40);
    store.reset();
    expect(store.criteria().resultLimit).toBe(4);
  });

  it('fetches only the screen-sized default without inventing twenty results', async () => {
    generate.mockResolvedValue({ ...dogImages, resultLimit: null });
    catalogue.search.mockImplementation(({ size }) =>
      of(page('bilder', 0, size, null)),
    );
    await store.send('Bilder av fugler', 4);
    expect(catalogue.search.mock.calls.at(-1)[0].size).toBe(4);
    expect(store.messages().at(-1)?.resultGroups?.[0].items).toHaveLength(4);
    await store.send('Bilder av hunder', 12);
    expect(catalogue.search.mock.calls.at(-1)[0].size).toBe(12);
    expect(store.messages().at(-1)?.resultGroups?.[0].items).toHaveLength(12);
    generate.mockResolvedValue({ ...dogImages, resultLimit: 40 });
    await store.send('Vis 40 bilder', 4);
    expect(catalogue.search.mock.calls.at(-1)[0].size).toBe(40);
    expect(store.messages().at(-1)?.resultGroups?.[0].items).toHaveLength(40);
  });

  function page(
    type: string,
    start: number,
    count: number,
    next: string | null,
  ): SuperSearchResult {
    const response = new SuperSearchResult();
    response.totalElements = 100;
    const group = type === 'bøker' ? response.books : response.photos;
    group.totalElements = 100;
    group.nextLink = next;
    group.items = Array.from(
      { length: count },
      (_, i) => new Item({ id: `${type}-${start + i}`, mediaType: type }),
    );
    return response;
  }

  const nextUrl = (type: string, pageNumber: number) =>
    `https://api.nb.no/catalog/v1/items?filter=mediatype%3A${encodeURIComponent(
      type,
    )}&filter=date%3A%5B20010101%20TO%2049991231%5D&size=20&page=${pageNumber}`;

  it('uses each next link and shows only new cards while keeping earlier answers intact', async () => {
    generate.mockResolvedValue({
      ...dogImages,
      mediaTypes: ['bilder', 'bøker'],
      fromYear: 2001,
    });
    catalogue.search.mockImplementation(({ mediaType }) =>
      of(page(mediaType, 0, 20, nextUrl(mediaType, 1))),
    );
    catalogue.searchByUrl.mockImplementation((type) =>
      of(page(type, 19, 21, nextUrl(type, 2))),
    );
    await store.send('Bilder og bøker av hunder etter 2000');
    const original = store.messages().at(-1);
    await store.send('Flere');
    expect(generate).toHaveBeenCalledTimes(1);
    expect(catalogue.search).toHaveBeenCalledTimes(2);
    expect(catalogue.searchByUrl.mock.calls).toEqual([
      ['bilder', nextUrl('bilder', 1)],
      ['bøker', nextUrl('bøker', 1)],
    ]);
    const expanded = store.messages().at(-1);
    expect(
      expanded?.resultGroups?.map((group) => [
        group.mediaType,
        group.items.length,
      ]),
    ).toEqual([
      ['bilder', 20],
      ['bøker', 20],
    ]);
    expect(expanded?.text).toContain('Hentet 40 nye treff');
    expect(expanded?.resultGroups?.[0].items[0].id).toBe('bilder-20');
    expect(expanded?.resultGroups?.[1].items[0].id).toBe('bøker-20');
    expect(original?.resultGroups?.map((group) => group.items.length)).toEqual([
      20, 20,
    ]);
    expect(store.criteria().date.fromDate).toBe('20010101');
    await store.undo();
    expect(store.messages().at(-1)).toBe(original);
    catalogue.searchByUrl.mockClear();
    await store.send('Vis flere treff');
    expect(catalogue.searchByUrl.mock.calls[0]).toEqual([
      'bilder',
      nextUrl('bilder', 1),
    ]);
  });

  it('loads only photos when a follow-up asks for more photos', async () => {
    generate.mockResolvedValue({
      ...dogImages,
      mediaTypes: ['bilder', 'bøker'],
    });
    catalogue.search.mockImplementation(({ mediaType }) =>
      of(page(mediaType, 0, 20, nextUrl(mediaType, 1))),
    );
    await store.send('Bilder og bøker');
    generate.mockResolvedValue({ action: 'more', mediaTypes: ['bilder'] });
    catalogue.searchByUrl.mockReturnValue(of(page('bilder', 20, 20, null)));
    await store.send('Flere bilder');
    expect(catalogue.searchByUrl).toHaveBeenCalledTimes(1);
    expect(catalogue.searchByUrl).toHaveBeenCalledWith(
      'bilder',
      nextUrl('bilder', 1),
    );
    expect(
      store
        .messages()
        .at(-1)
        ?.resultGroups?.map((group) => group.items.length),
    ).toEqual([20]);
    expect(store.messages().at(-1)?.resultGroups?.[0].mediaType).toBe('bilder');
  });

  it('shows each next page in its own carousel and preserves other media cursors', async () => {
    generate.mockResolvedValue({
      ...dogImages,
      mediaTypes: ['bilder', 'bøker'],
    });
    catalogue.search.mockImplementation(({ mediaType }) =>
      of(page(mediaType, 0, 20, nextUrl(mediaType, 1))),
    );
    catalogue.searchByUrl.mockImplementation((type, url) => {
      const number = Number(new URL(url).searchParams.get('page'));
      return of(
        page(
          type,
          number * 20,
          20,
          number < 2 ? nextUrl(type, number + 1) : null,
        ),
      );
    });
    await store.send('Bilder og bøker');
    const first = store.messages().at(-1);
    generate.mockResolvedValue({ action: 'more', mediaTypes: ['bilder'] });
    await store.send('Flere bilder');
    const second = store.messages().at(-1);
    await store.send('Flere');
    const third = store.messages().at(-1);
    expect(first?.resultGroups?.map((group) => group.items[0].id)).toEqual([
      'bilder-0',
      'bøker-0',
    ]);
    expect(second?.resultGroups?.map((group) => group.items[0].id)).toEqual([
      'bilder-20',
    ]);
    expect(third?.resultGroups?.map((group) => group.items[0].id)).toEqual([
      'bilder-40',
      'bøker-20',
    ]);
    expect(third?.resultGroups?.map((group) => group.items.length)).toEqual([
      20, 20,
    ]);
    await store.undo();
    await store.send('Flere');
    expect(
      store
        .messages()
        .at(-1)
        ?.resultGroups?.map((group) => group.items[0].id),
    ).toEqual(['bilder-40', 'bøker-20']);
  });

  it('does not advance the page after a failure and can retry the same link', async () => {
    const errorLog = jest
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    catalogue.search.mockReturnValue(
      of(page('bilder', 0, 20, nextUrl('bilder', 1))),
    );
    await store.send('Bilder');
    catalogue.searchByUrl
      .mockReturnValueOnce(throwError(() => new Error('offline')))
      .mockReturnValueOnce(of(page('bilder', 20, 20, null)));
    await store.send('flere');
    expect(store.messages().at(-1)?.text).toContain('Kunne ikke hente flere');
    await store.send('flere');
    expect(catalogue.searchByUrl.mock.calls.map((call) => call[1])).toEqual([
      nextUrl('bilder', 1),
      nextUrl('bilder', 1),
    ]);
    expect(store.messages().at(-1)?.resultGroups?.[0].items).toHaveLength(20);
    await store.send('flere');
    expect(store.messages().at(-1)?.text).toContain('ingen flere treff');
    expect(catalogue.searchByUrl).toHaveBeenCalledTimes(2);
    errorLog.mockRestore();
  });

  it('requires a search before loading more and rejects foreign pagination links', async () => {
    await store.send('flere');
    expect(store.messages().at(-1)?.text).toContain('Start med et søk');
    expect(generate).not.toHaveBeenCalled();
    catalogue.search.mockReturnValue(
      of(page('bilder', 0, 20, 'https://example.com/catalog/v1/items?page=1')),
    );
    await store.send('Bilder');
    const errorLog = jest
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    await store.send('flere');
    expect(catalogue.searchByUrl).not.toHaveBeenCalled();
    expect(store.messages().at(-1)?.text).toContain('Kunne ikke hente flere');
    errorLog.mockRestore();
  });

  it('cancels a pending next page when starting a new chat', async () => {
    catalogue.search.mockReturnValue(
      of(page('bilder', 0, 20, nextUrl('bilder', 1))),
    );
    await store.send('Bilder');
    const next = new Subject<SuperSearchResult>();
    catalogue.searchByUrl.mockReturnValue(next);
    const request = store.send('flere');
    expect(store.pending()).toBe(true);
    store.reset();
    next.next(page('bilder', 20, 20, null));
    next.complete();
    await request;
    expect(store.messages()).toEqual([]);
    expect(store.pending()).toBe(false);
  });

  it('does not change normal search criteria or dispatch normal search actions', async () => {
    await store.send('Bilder av hunder');
    await store.newestFirst();
    await store.undo();
    store.reset();
    expect(classicCriteria.value.q).toBe('vanlig søk');
    expect(classic.setCriteria).not.toHaveBeenCalled();
    expect(classic.search).not.toHaveBeenCalled();
    expect(classic.clearAll).not.toHaveBeenCalled();
  });

  it('ignores changes in normal search while interpreting a follow-up', async () => {
    await store.send('Bilder av hunder');
    let resolve!: (plan: unknown) => void;
    generate.mockReturnValue(
      new Promise((done) => {
        resolve = done;
      }),
    );
    const request = store.send('Etter 2000');
    classicCriteria.next(new Criteria({ q: 'katter', mediaType: 'aviser' }));
    resolve({ ...dogImages, fromYear: 2001 });
    await request;
    expect(store.criteria().q).toBe('hunder');
    expect(store.criteria().date.fromDate).toBe('20010101');
    expect(classicCriteria.value.q).toBe('katter');
  });

  it('restores criteria, conversation, and previous result cards with undo', async () => {
    await store.send('Bilder av hunder');
    const firstAnswer = store.messages()[1];
    generate.mockResolvedValue({ ...dogImages, fromYear: 2001 });
    await store.send('Etter 2000');
    await store.undo();
    expect(store.criteria()).toMatchObject({
      q: 'hunder',
      mediaType: 'bilder',
    });
    expect(store.criteria().date.value).toBeNull();
    expect(store.messages()[1]).toBe(firstAnswer);
    expect(store.messages().some((m) => m.text === 'Etter 2000')).toBe(false);
    expect(store.messages().at(-1)?.text).toContain(
      'Angret siste endring. Fant 42 treff',
    );
    await store.undo();
    expect(store.criteria().q).toBe('');
    expect(store.canUndo()).toBe(false);
    expect(catalogue.super).toHaveBeenCalled();
  });

  it('changes sorting and removes date restrictions without extra AI calls', async () => {
    generate.mockResolvedValue({ ...dogImages, fromYear: 2001 });
    await store.send('Bilder av hunder etter 2000');
    await store.newestFirst();
    await store.removeFilter({ type: 'date', label: 'Fra 2001' });
    expect(store.criteria()).toMatchObject({
      q: 'hunder',
      mediaType: 'bilder',
      sort: { value: 'date,desc' },
    });
    expect(store.criteria().date.value).toBeNull();
    expect(generate).toHaveBeenCalledTimes(1);
    await store.undo();
    expect(store.criteria().date.fromDate).toBe('20010101');
  });

  it('can clear the subject without dropping the image restriction', async () => {
    await store.send('Bilder av hunder');
    await store.removeFilter({ type: 'query', label: 'hunder' });
    expect(store.criteria().q).toBe('');
    expect(store.criteria().mediaType).toBe('bilder');
  });

  it('retains separate result snapshots per answer', async () => {
    catalogue.search
      .mockReturnValueOnce(of(results(12, 'old')))
      .mockReturnValueOnce(of(results(7, 'new')));
    await store.send('Bilder av hunder');
    generate.mockResolvedValue({ ...dogImages, fromYear: 2001 });
    await store.send('Etter 2000');
    expect(
      store.messages()[1].resultGroups?.flatMap((group) => group.items),
    ).toHaveLength(12);
    expect(store.messages()[1].resultGroups?.[0].items[0].id).toBe('old-0');
    expect(store.messages()[3].resultGroups?.[0].items[0].id).toBe('new-0');
    expect(store.messages()[3].total).toBe(7);
  });

  it('resolves city paths and photographer surname order through the catalogue', async () => {
    generate.mockResolvedValue({
      ...dogImages,
      places: ['Oslo'],
      creators: ['Anders Beer Wilse'],
    });
    typeahead.places.mockReturnValue(
      of([
        new Hint({
          label: 'Norge;Oslo;Oslo;Bygdøy',
          value: 'subjectgeographic:"Norge;Oslo;Oslo;Bygdøy"',
        }),
      ]),
    );
    typeahead.creators.mockReturnValue(
      of([
        new Hint({
          label: 'Wilse, Anders Beer',
          value: 'namecreators:"Wilse, Anders Beer"',
        }),
      ]),
    );
    await store.send('Bilder fra Oslo fotografert av Anders Beer Wilse');
    expect(store.criteria().filters.map((f) => f.value)).toEqual([
      'subjectgeographic:"Oslo"',
      'namecreators:"Wilse, Anders Beer"',
    ]);
    generate.mockResolvedValue({ ...dogImages, fromYear: 2001 });
    await store.send('Etter 2000');
    expect(store.criteria().filters).toHaveLength(2);
    expect(typeahead.places).toHaveBeenCalledTimes(1);
  });

  it('asks for clarification instead of applying ambiguous creator filters', async () => {
    generate.mockResolvedValue({ ...dogImages, creators: ['Olsen'] });
    typeahead.creators.mockReturnValue(
      of([
        new Hint({ label: 'Olsen, Per' }),
        new Hint({ label: 'Olsen, Kari' }),
      ]),
    );
    await store.send('Fotografert av Olsen');
    expect(store.criteria().q).toBe('');
    expect(catalogue.search).not.toHaveBeenCalled();
    expect(store.messages().at(-1)?.text).toContain('Olsen, Per; Olsen, Kari');
  });

  it('waits for the catalogue before reporting a count', async () => {
    const response = new Subject<SuperSearchResult>();
    let subscribed!: () => void;
    const started = new Promise<void>((done) => {
      subscribed = done;
    });
    catalogue.search.mockImplementation(() => {
      subscribed();
      return response;
    });
    const request = store.send('Bilder av hunder');
    await started;
    expect(store.pending()).toBe(true);
    expect(store.pendingLabel()).toBe('Søker i katalogen …');
    expect(store.messages()).toHaveLength(1);
    response.next(results(0));
    await request;
    expect(store.messages().at(-1)?.text).toContain('Fant 0 treff');
  });

  it('cancels pending catalogue results when resetting and keeps a new request independent', async () => {
    const response = new Subject<SuperSearchResult>();
    let subscribed!: () => void;
    const started = new Promise<void>((done) => {
      subscribed = done;
    });
    catalogue.search.mockImplementationOnce(() => {
      subscribed();
      return response;
    });
    const request = store.send('Bilder av hunder');
    await started;
    store.reset();
    await request;
    expect(response.observed).toBe(false);
    expect(store.messages()).toEqual([]);
    expect(store.criteria().q).toBe('');
    expect(store.status()).toBe('idle');
    await store.send('Bilder av hunder');
    response.next(results(999));
    expect(store.messages().at(-1)?.total).toBe(42);
  });

  it('aborts the model request and ignores a late reply after reset', async () => {
    let resolve!: (plan: unknown) => void;
    generate.mockReturnValue(
      new Promise((done) => {
        resolve = done;
      }),
    );
    const request = store.send('Bilder av hunder');
    const signal = generate.mock.calls[0][3] as AbortSignal;
    store.reset();
    expect(signal.aborted).toBe(true);
    resolve(dogImages);
    await request;
    expect(store.messages()).toEqual([]);
    expect(catalogue.search).not.toHaveBeenCalled();
  });

  it('keeps criteria undoable if the catalogue fails without inventing a count', async () => {
    const log = jest
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    catalogue.search.mockReturnValue(throwError(() => new Error('Offline')));
    await store.send('Bilder av hunder');
    expect(store.criteria().q).toBe('hunder');
    expect(store.messages().at(-1)?.text).toContain('katalogen kunne ikke');
    expect(store.messages().at(-1)?.total).toBeUndefined();
    expect(store.canUndo()).toBe(true);
    log.mockRestore();
  });

  it.each([
    [new ChatSearchRequestError('model', true), 'for lang tid'],
    [new ChatSearchRequestError('app-check', false), 'bekrefte tilkoblingen'],
  ])(
    'explains request failures without changing criteria',
    async (error, message) => {
      const log = jest
        .spyOn(console, 'error')
        .mockImplementation(() => undefined);
      generate.mockRejectedValue(error);
      await store.send('Bilder av hunder');
      expect(store.error()).toContain(message);
      expect(store.status()).toBe('error');
      expect(store.criteria().q).toBe('');
      expect(store.pending()).toBe(false);
      log.mockRestore();
    },
  );

  it('does not search for an AI clarification', async () => {
    generate.mockResolvedValue({ action: 'clarify', message: 'Hvilket år?' });
    await store.send('Etter det året');
    expect(catalogue.super).not.toHaveBeenCalled();
    expect(catalogue.search).not.toHaveBeenCalled();
    expect(store.messages().at(-1)?.text).toBe('Hvilket år?');
  });

  it('rejects a duplicate send while a request is pending', async () => {
    let resolve!: (plan: unknown) => void;
    generate.mockReturnValue(
      new Promise((done) => {
        resolve = done;
      }),
    );
    const request = store.send('Bilder av hunder');
    await store.send('Etter 2000');
    expect(generate).toHaveBeenCalledTimes(1);
    resolve(dogImages);
    await request;
  });
});
