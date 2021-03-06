import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AUTH_FEATURE_KEY, AuthState } from './auth.reducer';

const getAuthState = createFeatureSelector<AuthState>(AUTH_FEATURE_KEY);

const currentUser = createSelector(
  getAuthState,
  (state: AuthState) => {
    return state ? state.user : null;
  }
);
const getError = createSelector(
  getAuthState,
  (state: AuthState) => state.error
);
const getState = createSelector(
  getAuthState,
  (state: AuthState) => state
);

export const authQuery = {
  getState,
  currentUser,
  getError
};
