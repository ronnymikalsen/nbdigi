import { createReducer, on } from '@ngrx/store';
import { AppActionTypes } from './app.actions';

export const APP_FEATURE_KEY = 'app';

export interface AppState {
  debug: boolean;
  theme: string;
  showDateGraph: boolean;
}

export interface AppPartialState {
  readonly [APP_FEATURE_KEY]: AppState;
}

export const initialState: AppState = {
  debug: false,
  theme: 'light',
  showDateGraph: true,
};

export function appReducer(state: any, action: any): AppState {
  switch (action.type) {
    case AppActionTypes.DebugOn: {
      state = {
        ...state,
        debug: true,
      };
      break;
    }
    case AppActionTypes.DebugOff: {
      state = {
        ...state,
        debug: false,
      };
      break;
    }
    case AppActionTypes.ShowDateGraph: {
      state = {
        ...state,
        showDateGraph: true,
      };
      break;
    }
    case AppActionTypes.HideDateGraph: {
      state = {
        ...state,
        showDateGraph: false,
      };
      break;
    }
    case AppActionTypes.SetTheme: {
      state = {
        ...state,
        theme: action.payload,
      };
      break;
    }
  }
  return state;
}
