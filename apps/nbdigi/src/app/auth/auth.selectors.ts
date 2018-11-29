import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AUTH_FEATURE_KEY, AuthState } from './auth.reducer';

const getAuthState = createFeatureSelector<AuthState>(AUTH_FEATURE_KEY);

const currentUser = createSelector(
  getAuthState,
  (state: AuthState) => state.user
);
const getError = createSelector(
  getAuthState,
  (state: AuthState) => state.error
);

export const authQuery = {
  currentUser,
  getError,
};
