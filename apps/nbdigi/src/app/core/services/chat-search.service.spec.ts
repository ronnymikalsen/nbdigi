import { Criteria, DateOption, Hint, Item, SuperSearchResult } from '../models';
import { QueryBuilder } from '../builders/query-builder';
import {
  applyChatSearchPlan,
  verifyChatAppCheck,
  getChatResultGroups,
} from './chat-search.service';

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

describe('chat carousel snapshots', () => {
  it('keeps up to twenty independent cards per media type with its own count', () => {
    const result = new SuperSearchResult();
    result.books.totalElements = 124;
    result.photos.totalElements = 83;
    result.books.items = Array.from(
      { length: 25 },
      (_, i) => new Item({ id: `book-${i}` }),
    );
    result.photos.items = Array.from(
      { length: 25 },
      (_, i) => new Item({ id: `photo-${i}` }),
    );
    const groups = getChatResultGroups(result, [], 20);
    expect(
      groups.map((group) => [
        group.label,
        group.totalElements,
        group.items.length,
      ]),
    ).toEqual([
      ['Bøker', 124, 20],
      ['Bilder', 83, 20],
    ]);
    result.books.items[0].title = 'Changed later';
    result.books.items.push(new Item({ id: 'later' }));
    result.books.totalElements = 999;
    expect(groups[0].items[0].title).toBe('');
    expect(groups[0].items).toHaveLength(20);
    expect(groups[0].totalElements).toBe(124);
  });

  it.each([
    [
      ['bilder', 'bøker'],
      ['Bilder', 'Bøker', 'Kart'],
    ],
    [
      ['bøker', 'bilder'],
      ['Bøker', 'Bilder', 'Kart'],
    ],
    [
      ['kart', 'bilder', 'bøker'],
      ['Kart', 'Bilder', 'Bøker'],
    ],
    [['alle'], ['Bøker', 'Bilder', 'Kart']],
  ])(
    'uses requested media order %j with a stable fallback',
    (order, labels) => {
      const result = new SuperSearchResult();
      result.books.items = [new Item({ id: 'book' })];
      result.photos.items = [new Item({ id: 'photo' })];
      result.maps.items = [new Item({ id: 'map' })];
      expect(
        getChatResultGroups(result, order).map((group) => group.label),
      ).toEqual(labels);
    },
  );

  it('retains the requested number per carousel instead of truncating to twenty', () => {
    const result = new SuperSearchResult();
    result.books.items = Array.from(
      { length: 50 },
      (_, i) => new Item({ id: `book-${i}` }),
    );
    expect(getChatResultGroups(result, ['bøker'], 40)[0].items).toHaveLength(
      40,
    );
  });

  it('keeps all available photos when books have few matches', () => {
    const result = new SuperSearchResult();
    result.books.items = [new Item({ id: 'book' })];
    result.photos.items = Array.from(
      { length: 20 },
      (_, i) => new Item({ id: `photo-${i}` }),
    );
    expect(
      getChatResultGroups(result, [], 20).map((group) => group.items.length),
    ).toEqual([1, 20]);
    expect(getChatResultGroups(new SuperSearchResult())).toEqual([]);
  });

  it('deduplicates cards within each media type without discarding another type', () => {
    const result = new SuperSearchResult();
    result.books.items = [
      new Item({ id: 'book' }),
      new Item({ id: 'book' }),
      new Item({ id: 'shared' }),
    ];
    result.photos.items = [
      new Item({ id: 'photo' }),
      new Item({ id: 'shared' }),
    ];
    expect(
      getChatResultGroups(result).map((group) =>
        group.items.map((item) => item.id),
      ),
    ).toEqual([
      ['book', 'shared'],
      ['photo', 'shared'],
    ]);
  });
});

describe('chat pagination plans', () => {
  it('accepts more requests without changing criteria', () => {
    expect(
      applyChatSearchPlan(
        { action: 'more', mediaTypes: ['bilder'] },
        new Criteria(),
      ),
    ).toEqual({ more: ['bilder'] });
  });
  it.each([
    { mediaTypes: [] },
    { mediaTypes: ['invented'] },
    { mediaTypes: ['alle', 'bilder'] },
    { mediaTypes: 'bilder' },
  ])('rejects invalid pagination media types %j', ({ mediaTypes }) => {
    expect(() =>
      applyChatSearchPlan({ action: 'more', mediaTypes }, new Criteria()),
    ).toThrow();
  });
});

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

  it('normalizes repeated types and supports adding and removing media types', () => {
    const mixed = applyChatSearchPlan(
      { ...dogImages, mediaTypes: ['bilder', 'bøker', 'bilder'] },
      new Criteria(),
    ).criteria;
    if (!mixed) throw new Error('Missing mixed-media criteria');
    expect(mixed.mediaTypes).toEqual(['bilder', 'bøker']);
    const added = applyChatSearchPlan(
      { ...dogImages, mediaTypes: ['bilder', 'bøker', 'kart'], fromYear: 2001 },
      mixed,
    ).criteria;
    if (!added) throw new Error('Missing expanded criteria');
    expect(added.mediaTypes).toEqual(['bilder', 'bøker', 'kart']);
    expect(mixed.mediaTypes).toEqual(['bilder', 'bøker']);
    const removed = applyChatSearchPlan(
      { ...dogImages, mediaTypes: ['bøker', 'kart'], fromYear: 2001 },
      added,
    ).criteria;
    if (!removed) throw new Error('Missing narrowed criteria');
    expect(removed.mediaTypes).toEqual(['bøker', 'kart']);
    expect(removed.q).toBe('hunder');
    expect(removed.date.fromDate).toBe('20010101');
  });

  it('uses the screen limit for automatic sizing and the full explicit count when requested', () => {
    const current = Object.assign(new Criteria(), { defaultResultLimit: 12 });
    expect(
      applyChatSearchPlan({ ...dogImages, resultLimit: null }, current)
        .criteria,
    ).toMatchObject({ resultLimit: 12, resultLimitExplicit: false });
    expect(
      applyChatSearchPlan({ ...dogImages, resultLimit: 40 }, current).criteria,
    ).toMatchObject({ resultLimit: 40, resultLimitExplicit: true });
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
    { mediaTypes: ['invented'] },
    { mediaTypes: [] },
    { mediaTypes: 'bilder' },
    { mediaTypes: [null] },
    { mediaTypes: ['alle', 'bilder'] },
    { mediaTypes: ['bilder', 'mediatype:bøker'] },
    { resultLimit: 0 },
    { resultLimit: -1 },
    { resultLimit: 101 },
    { resultLimit: 20.5 },
    { resultLimit: '40' },
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
