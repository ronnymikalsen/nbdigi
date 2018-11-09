import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  AUTHENTICATIONSTATE_FEATURE_KEY,
  AuthenticationstateState
} from './authenticationstate.reducer';

// Lookup the 'Authenticationstate' feature state managed by NgRx
const getAuthenticationstateState = createFeatureSelector<
  AuthenticationstateState
>(AUTHENTICATIONSTATE_FEATURE_KEY);

const getLoaded = createSelector(
  getAuthenticationstateState,
  (state: AuthenticationstateState) => state.loaded
);
const getError = createSelector(
  getAuthenticationstateState,
  (state: AuthenticationstateState) => state.error
);

const getAllAuthenticationstate = createSelector(
  getAuthenticationstateState,
  getLoaded,
  (state: AuthenticationstateState, isLoaded) => {
    return isLoaded ? state.list : [];
  }
);
const getSelectedId = createSelector(
  getAuthenticationstateState,
  (state: AuthenticationstateState) => state.selectedId
);
const getSelectedAuthenticationstate = createSelector(
  getAllAuthenticationstate,
  getSelectedId,
  (authenticationstate, id) => {
    const result = authenticationstate.find(it => it['id'] === id);
    return result ? Object.assign({}, result) : undefined;
  }
);

export const authenticationstateQuery = {
  getLoaded,
  getError,
  getAllAuthenticationstate,
  getSelectedAuthenticationstate
};
