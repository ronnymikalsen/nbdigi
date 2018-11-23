import { AuthError as AuthErrorModel, User } from '@nbdigi/data-models';
import { SessionAction, SessionActionTypes } from './session.actions';

export const SESSION_FEATURE_KEY = 'session';

export interface SessionState {
  user?: User;
  error?: AuthErrorModel;
  debug: boolean;
  theme: string;
  showDateGraph: boolean;
}

export interface SessionPartialState {
  readonly [SESSION_FEATURE_KEY]: SessionState;
}

export const initialState: SessionState = {
  user: null,
  error: null,
  debug: false,
  theme: null,
  showDateGraph: true
};

export function sessionReducer(
  state: SessionState = initialState,
  action: SessionAction
): SessionState {
  switch (action.type) {
    case SessionActionTypes.SignedIn: {
      state = {
        ...state,
        user: action.payload,
        error: null
      };
      break;
    }
    case SessionActionTypes.AuthError: {
      state = {
        ...state,
        error: action.payload
      };
      break;
    }
    case SessionActionTypes.AuthError: {
      state = {
        ...state,
        error: action.payload
      };
      break;
    }
    case SessionActionTypes.DebugOn: {
      state = {
        ...state,
        debug: true
      };
      break;
    }
    case SessionActionTypes.DebugOff: {
      state = {
        ...state,
        debug: false
      };
      break;
    }
    case SessionActionTypes.ShowDateGraph: {
      state = {
        ...state,
        showDateGraph: true
      };
      break;
    }
    case SessionActionTypes.HideDateGraph: {
      state = {
        ...state,
        showDateGraph: false
      };
      break;
    }
  }
  return state;
}
