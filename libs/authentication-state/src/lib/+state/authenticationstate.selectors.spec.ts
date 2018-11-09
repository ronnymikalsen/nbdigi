import {
  Entity,
  AuthenticationstateState
} from './authenticationstate.reducer';
import { authenticationstateQuery } from './authenticationstate.selectors';

describe('Authenticationstate Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getAuthenticationstateId = it => it['id'];

  let storeState;

  beforeEach(() => {
    const createAuthenticationstate = (id: string, name = ''): Entity => ({
      id,
      name: name || `name-${id}`
    });
    storeState = {
      authenticationstate: {
        list: [
          createAuthenticationstate('PRODUCT-AAA'),
          createAuthenticationstate('PRODUCT-BBB'),
          createAuthenticationstate('PRODUCT-CCC')
        ],
        selectedId: 'PRODUCT-BBB',
        error: ERROR_MSG,
        loaded: true
      }
    };
  });

  describe('Authenticationstate Selectors', () => {
    it('getAllAuthenticationstate() should return the list of Authenticationstate', () => {
      const results = authenticationstateQuery.getAllAuthenticationstate(
        storeState
      );
      const selId = getAuthenticationstateId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });

    it('getSelectedAuthenticationstate() should return the selected Entity', () => {
      const result = authenticationstateQuery.getSelectedAuthenticationstate(
        storeState
      );
      const selId = getAuthenticationstateId(result);

      expect(selId).toBe('PRODUCT-BBB');
    });

    it("getLoaded() should return the current 'loaded' status", () => {
      const result = authenticationstateQuery.getLoaded(storeState);

      expect(result).toBe(true);
    });

    it("getError() should return the current 'error' storeState", () => {
      const result = authenticationstateQuery.getError(storeState);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
