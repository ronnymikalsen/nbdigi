import {
  AuthAction,
  AuthActionTypes,
  AuthError
} from './../actions/session.actions';
import { User } from './../../models/user.model';
import { AuthError as AuthErrorModel } from './../../models/auth-error.model';

export interface State {
  user?: User;
  error?: AuthErrorModel;
}

export const initialState: State = {
  user: null,
  error: null
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
    default: {
      return state;
    }
  }
}

export const currentUser = (state: State) => state.user;
export const getError = (state: State) => state.error;
