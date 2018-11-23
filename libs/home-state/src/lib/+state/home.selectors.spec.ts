import { Entity, HomeState } from './home.reducer';
import { homeQuery } from './home.selectors';

describe('Home Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getHomeId = it => it['id'];

  let storeState;

  beforeEach(() => {
    const createHome = (id: string, name = ''): Entity => ({
      id,
      name: name || `name-${id}`
    });
    storeState = {
      home: {
        list: [
          createHome('PRODUCT-AAA'),
          createHome('PRODUCT-BBB'),
          createHome('PRODUCT-CCC')
        ],
        selectedId: 'PRODUCT-BBB',
        error: ERROR_MSG,
        loaded: true
      }
    };
  });

  describe('Home Selectors', () => {
    it('getAllHome() should return the list of Home', () => {
      const results = homeQuery.getAllHome(storeState);
      const selId = getHomeId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });

    it('getSelectedHome() should return the selected Entity', () => {
      const result = homeQuery.getSelectedHome(storeState);
      const selId = getHomeId(result);

      expect(selId).toBe('PRODUCT-BBB');
    });

    it("getLoaded() should return the current 'loaded' status", () => {
      const result = homeQuery.getLoaded(storeState);

      expect(result).toBe(true);
    });

    it("getError() should return the current 'error' storeState", () => {
      const result = homeQuery.getError(storeState);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
