import {
  AuthenticationstateAction,
  AuthenticationstateActionTypes
} from './authenticationstate.actions';

export const AUTHENTICATIONSTATE_FEATURE_KEY = 'authenticationstate';

/**
 * Interface for the 'Authenticationstate' data used in
 *  - AuthenticationstateState, and
 *  - authenticationstateReducer
 *
 *  Note: replace if already defined in another module
 */

/* tslint:disable:no-empty-interface */
export interface Entity {}

export interface AuthenticationstateState {
  list: Entity[]; // list of Authenticationstate; analogous to a sql normalized table
  selectedId?: string | number; // which Authenticationstate record has been selected
  loaded: boolean; // has the Authenticationstate list been loaded
  error?: any; // last none error (if any)
}

export interface AuthenticationstatePartialState {
  readonly [AUTHENTICATIONSTATE_FEATURE_KEY]: AuthenticationstateState;
}

export const initialState: AuthenticationstateState = {
  list: [],
  loaded: false
};

export function authenticationstateReducer(
  state: AuthenticationstateState = initialState,
  action: AuthenticationstateAction
): AuthenticationstateState {
  switch (action.type) {
    case AuthenticationstateActionTypes.AuthenticationstateLoaded: {
      state = {
        ...state,
        list: action.payload,
        loaded: true
      };
      break;
    }
  }
  return state;
}
