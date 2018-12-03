import { AuthError as AuthErrorModel, User } from '../../core/models';
import { AuthAction, AuthActionTypes } from './auth.actions';

export const AUTH_FEATURE_KEY = 'auth';

export interface AuthState {
  user?: User;
  error?: AuthErrorModel;
}

export interface AuthPartialState {
  readonly [AUTH_FEATURE_KEY]: AuthState;
}

export const initialState: AuthState = {
  user: null,
  error: null
};

export function authReducer(
  state: AuthState = initialState,
  action: AuthAction
): AuthState {
  switch (action.type) {
    case AuthActionTypes.SignedIn: {
      state = {
        ...state,
        user: action.payload,
        error: null
      };
      break;
    }
    case AuthActionTypes.AuthError: {
      state = {
        ...state,
        error: action.payload
      };
      break;
    }
    case AuthActionTypes.AuthError: {
      state = {
        ...state,
        error: action.payload
      };
      break;
    }
  }
  return state;
}
