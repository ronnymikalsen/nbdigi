import { Entity, ItemState } from './item.reducer';
import { itemQuery } from './item.selectors';

describe('Item Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getItemId = it => it['id'];

  let storeState;

  beforeEach(() => {
    const createItem = (id: string, name = ''): Entity => ({
      id,
      name: name || `name-${id}`
    });
    storeState = {
      item: {
        list: [
          createItem('PRODUCT-AAA'),
          createItem('PRODUCT-BBB'),
          createItem('PRODUCT-CCC')
        ],
        selectedId: 'PRODUCT-BBB',
        error: ERROR_MSG,
        loaded: true
      }
    };
  });

  describe('Item Selectors', () => {
    it('getAllItem() should return the list of Item', () => {
      const results = itemQuery.getAllItem(storeState);
      const selId = getItemId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });

    it('getSelectedItem() should return the selected Entity', () => {
      const result = itemQuery.getSelectedItem(storeState);
      const selId = getItemId(result);

      expect(selId).toBe('PRODUCT-BBB');
    });

    it("getLoaded() should return the current 'loaded' status", () => {
      const result = itemQuery.getLoaded(storeState);

      expect(result).toBe(true);
    });

    it("getError() should return the current 'error' storeState", () => {
      const result = itemQuery.getError(storeState);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
