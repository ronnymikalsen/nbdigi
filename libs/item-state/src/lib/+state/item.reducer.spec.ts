import { ItemLoaded } from './item.actions';
import { ItemState, Entity, initialState, itemReducer } from './item.reducer';

describe('Item Reducer', () => {
  const getItemId = it => it['id'];
  let createItem;

  beforeEach(() => {
    createItem = (id: string, name = ''): Entity => ({
      id,
      name: name || `name-${id}`
    });
  });

  describe('valid Item actions ', () => {
    it('should return set the list of known Item', () => {
      const items = [createItem('PRODUCT-AAA'), createItem('PRODUCT-zzz')];
      const action = new ItemLoaded(items);
      const result: ItemState = itemReducer(initialState, action);
      const selId: string = getItemId(result.list[1]);

      expect(result.loaded).toBe(true);
      expect(result.list.length).toBe(2);
      expect(selId).toBe('PRODUCT-zzz');
    });
  });

  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any;
      const result = itemReducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
