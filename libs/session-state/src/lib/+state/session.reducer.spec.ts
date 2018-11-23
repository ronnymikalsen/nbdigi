import { SessionLoaded } from './session.actions';
import {
  SessionState,
  Entity,
  initialState,
  sessionReducer
} from './session.reducer';

describe('Session Reducer', () => {
  const getSessionId = it => it['id'];
  let createSession;

  beforeEach(() => {
    createSession = (id: string, name = ''): Entity => ({
      id,
      name: name || `name-${id}`
    });
  });

  describe('valid Session actions ', () => {
    it('should return set the list of known Session', () => {
      const sessions = [
        createSession('PRODUCT-AAA'),
        createSession('PRODUCT-zzz')
      ];
      const action = new SessionLoaded(sessions);
      const result: SessionState = sessionReducer(initialState, action);
      const selId: string = getSessionId(result.list[1]);

      expect(result.loaded).toBe(true);
      expect(result.list.length).toBe(2);
      expect(selId).toBe('PRODUCT-zzz');
    });
  });

  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any;
      const result = sessionReducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
