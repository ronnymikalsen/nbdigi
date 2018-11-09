import { AuthenticationstateLoaded } from './authenticationstate.actions';
import {
  AuthenticationstateState,
  Entity,
  initialState,
  authenticationstateReducer
} from './authenticationstate.reducer';

describe('Authenticationstate Reducer', () => {
  const getAuthenticationstateId = it => it['id'];
  let createAuthenticationstate;

  beforeEach(() => {
    createAuthenticationstate = (id: string, name = ''): Entity => ({
      id,
      name: name || `name-${id}`
    });
  });

  describe('valid Authenticationstate actions ', () => {
    it('should return set the list of known Authenticationstate', () => {
      const authenticationstates = [
        createAuthenticationstate('PRODUCT-AAA'),
        createAuthenticationstate('PRODUCT-zzz')
      ];
      const action = new AuthenticationstateLoaded(authenticationstates);
      const result: AuthenticationstateState = authenticationstateReducer(
        initialState,
        action
      );
      const selId: string = getAuthenticationstateId(result.list[1]);

      expect(result.loaded).toBe(true);
      expect(result.list.length).toBe(2);
      expect(selId).toBe('PRODUCT-zzz');
    });
  });

  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any;
      const result = authenticationstateReducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
