import { HomeLoaded } from './home.actions';
import { HomeState, Entity, initialState, homeReducer } from './home.reducer';

describe('Home Reducer', () => {
  const getHomeId = it => it['id'];
  let createHome;

  beforeEach(() => {
    createHome = (id: string, name = ''): Entity => ({
      id,
      name: name || `name-${id}`
    });
  });

  describe('valid Home actions ', () => {
    it('should return set the list of known Home', () => {
      const homes = [createHome('PRODUCT-AAA'), createHome('PRODUCT-zzz')];
      const action = new HomeLoaded(homes);
      const result: HomeState = homeReducer(initialState, action);
      const selId: string = getHomeId(result.list[1]);

      expect(result.loaded).toBe(true);
      expect(result.list.length).toBe(2);
      expect(selId).toBe('PRODUCT-zzz');
    });
  });

  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any;
      const result = homeReducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
