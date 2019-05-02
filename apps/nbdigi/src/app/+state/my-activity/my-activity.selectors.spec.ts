import { Entity, MyActivityState } from './my-activity.reducer';
import { myActivityQuery } from './my-activity.selectors';

describe('MyActivity Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getMyActivityId = it => it['id'];

  let storeState;

  beforeEach(() => {
    const createMyActivity = (id: string, name = ''): Entity => ({
      id,
      name: name || `name-${id}`
    });
    storeState = {
      myActivity: {
        list: [
          createMyActivity('PRODUCT-AAA'),
          createMyActivity('PRODUCT-BBB'),
          createMyActivity('PRODUCT-CCC')
        ],
        selectedId: 'PRODUCT-BBB',
        error: ERROR_MSG,
        loaded: true
      }
    };
  });

  describe('MyActivity Selectors', () => {
    it('getAllMyActivity() should return the list of MyActivity', () => {
      const results = myActivityQuery.getAllMyActivity(storeState);
      const selId = getMyActivityId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });

    it('getSelectedMyActivity() should return the selected Entity', () => {
      const result = myActivityQuery.getSelectedMyActivity(storeState);
      const selId = getMyActivityId(result);

      expect(selId).toBe('PRODUCT-BBB');
    });

    it("getLoaded() should return the current 'loaded' status", () => {
      const result = myActivityQuery.getLoaded(storeState);

      expect(result).toBe(true);
    });

    it("getError() should return the current 'error' storeState", () => {
      const result = myActivityQuery.getError(storeState);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
