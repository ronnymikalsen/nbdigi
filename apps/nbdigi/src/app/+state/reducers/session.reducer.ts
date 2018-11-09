import { AuthError as AuthErrorModel, User } from '@nbdigi/data-models';
import { AuthAction, AuthActionTypes } from '../actions/session.actions';

export interface State {
  user?: User;
  error?: AuthErrorModel;
  debug: boolean;
  theme: string;
  showDateGraph: boolean;
}

export const initialState: State = {
  user: null,
  error: null,
  debug: false,
  theme: null,
  showDateGraph: true
};

export function reducer(state = initialState, action: AuthAction): State {
  switch (action.type) {
    case AuthActionTypes.SignedIn: {
      return {
        ...state,
        user: action.payload,
        error: null
      };
    }
    case AuthActionTypes.AuthError: {
      return {
        ...state,
        error: action.payload
      };
    }
    case AuthActionTypes.AuthError: {
      return {
        ...state,
        error: action.payload
      };
    }
    case AuthActionTypes.DebugOn: {
      return {
        ...state,
        debug: true
      };
    }
    case AuthActionTypes.DebugOff: {
      return {
        ...state,
        debug: false
      };
    }
    case AuthActionTypes.ShowDateGraph: {
      return {
        ...state,
        showDateGraph: true
      };
    }
    case AuthActionTypes.HideDateGraph: {
      return {
        ...state,
        showDateGraph: false
      };
    }
    default: {
      return state;
    }
  }
}

export const currentUser = (state: State) => state.user;
export const getError = (state: State) => state.error;
export const isDebugOn = (state: State) =>
  state.user ? state.user.isDebugOn : false;
export const getTheme = (state: State) =>
  state.user ? state.user.theme : localStorage.getItem('currentTheme');
export const showDateGraph = (state: State) => state.showDateGraph;
