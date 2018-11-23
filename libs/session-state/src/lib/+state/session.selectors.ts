import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SessionState, SESSION_FEATURE_KEY } from './session.reducer';

const getSessionState = createFeatureSelector<SessionState>(
  SESSION_FEATURE_KEY
);

const currentUser = createSelector(
  getSessionState,
  (state: SessionState) => state.user
);
const getError = createSelector(
  getSessionState,
  (state: SessionState) => state.error
);
const isDebugOn = createSelector(getSessionState, (state: SessionState) =>
  state.user ? state.user.isDebugOn : false
);
const getTheme = createSelector(getSessionState, (state: SessionState) =>
  state.user ? state.user.theme : localStorage.getItem('currentTheme')
);

const showDateGraph = createSelector(
  getSessionState,
  (state: SessionState) => state.showDateGraph
);

export const sessionQuery = {
  currentUser,
  getError,
  isDebugOn,
  getTheme,
  showDateGraph
};
