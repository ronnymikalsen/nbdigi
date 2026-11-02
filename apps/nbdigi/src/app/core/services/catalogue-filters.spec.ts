import { Criteria, DateOption, Hint, User } from '../models';
import { buildCatalogueFilters } from './search.service';

describe('shared catalogue filters', () => {
  const rightsFilter =
    'contentClasses:ccbyncnd OR contentClasses:publicdomain OR contentClasses:ccbync OR contentClasses:cc0';

  it('keeps date, enabled hints, digital format and access restrictions together', () => {
    const criteria = new Criteria({
      date: new DateOption({ value: 'date:[20010101 TO 49991231]' }),
      filters: [
        new Hint({ value: 'subjectgeographic:"Oslo"' }),
        new Hint({ value: 'language:eng', enabled: false }),
      ],
    });
    expect(
      buildCatalogueFilters(criteria, { uid: 'regular-user' } as User),
    ).toEqual([
      'subjectgeographic:"Oslo"',
      rightsFilter,
      'digital:Ja',
      'contentClasses:jp2',
      'date:[20010101 TO 49991231]',
    ]);
  });

  it.each([
    '8Ntufmqo1RhCYMbmWv1Ocz156ts1',
    'dr2snqxHiZRSEkCUUOOfw6pFkJm2',
    'iHr3SCdKewU6M3bNGLMUwqxvDu73',
    'V9q3474Py0PfJx8zKeQ3DHlmklR2',
  ])(
    'preserves the existing catalogue restrictions for the configured account %s',
    (uid) => {
      const filters = buildCatalogueFilters(new Criteria(), { uid } as User);
      expect(filters).not.toContain(rightsFilter);
      expect(filters).toEqual(['digital:Ja', 'contentClasses:jp2']);
    },
  );
});
