import { MyActivityLoaded } from './my-activity.actions';
import {
  MyActivityState,
  Entity,
  initialState,
  myActivityReducer
} from './my-activity.reducer';

describe('MyActivity Reducer', () => {
  const getMyActivityId = it => it['id'];
  let createMyActivity;

  beforeEach(() => {
    createMyActivity = (id: string, name = ''): Entity => ({
      id,
      name: name || `name-${id}`
    });
  });

  describe('valid MyActivity actions ', () => {
    it('should return set the list of known MyActivity', () => {
      const myActivitys = [
        createMyActivity('PRODUCT-AAA'),
        createMyActivity('PRODUCT-zzz')
      ];
      const action = new MyActivityLoaded(myActivitys);
      const result: MyActivityState = myActivityReducer(initialState, action);
      const selId: string = getMyActivityId(result.list[1]);

      expect(result.loaded).toBe(true);
      expect(result.list.length).toBe(2);
      expect(selId).toBe('PRODUCT-zzz');
    });
  });

  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any;
      const result = myActivityReducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
