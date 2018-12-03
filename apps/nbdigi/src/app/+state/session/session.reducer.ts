import { SessionAction, SessionActionTypes } from './session.actions';

export const SESSION_FEATURE_KEY = 'session';

export interface SessionState {
  debug: boolean;
  theme: string;
  showDateGraph: boolean;
}

export interface SessionPartialState {
  readonly [SESSION_FEATURE_KEY]: SessionState;
}

export const initialState: SessionState = {
  debug: false,
  theme: null,
  showDateGraph: true
};

export function sessionReducer(
  state: SessionState = initialState,
  action: SessionAction
): SessionState {
  switch (action.type) {
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
    case SessionActionTypes.SetTheme: {
      state = {
        ...state,
        theme: action.payload
      };
      break;
    }
  }
  return state;
}
