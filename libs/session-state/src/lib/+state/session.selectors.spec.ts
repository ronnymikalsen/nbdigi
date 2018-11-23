import { Entity, SessionState } from './session.reducer';
import { sessionQuery } from './session.selectors';

describe('Session Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getSessionId = it => it['id'];

  let storeState;

  beforeEach(() => {
    const createSession = (id: string, name = ''): Entity => ({
      id,
      name: name || `name-${id}`
    });
    storeState = {
      session: {
        list: [
          createSession('PRODUCT-AAA'),
          createSession('PRODUCT-BBB'),
          createSession('PRODUCT-CCC')
        ],
        selectedId: 'PRODUCT-BBB',
        error: ERROR_MSG,
        loaded: true
      }
    };
  });

  describe('Session Selectors', () => {
    it('getAllSession() should return the list of Session', () => {
      const results = sessionQuery.getAllSession(storeState);
      const selId = getSessionId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });

    it('getSelectedSession() should return the selected Entity', () => {
      const result = sessionQuery.getSelectedSession(storeState);
      const selId = getSessionId(result);

      expect(selId).toBe('PRODUCT-BBB');
    });

    it("getLoaded() should return the current 'loaded' status", () => {
      const result = sessionQuery.getLoaded(storeState);

      expect(result).toBe(true);
    });

    it("getError() should return the current 'error' storeState", () => {
      const result = sessionQuery.getError(storeState);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
