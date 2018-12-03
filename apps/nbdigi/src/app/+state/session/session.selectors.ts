import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SessionState, SESSION_FEATURE_KEY } from './session.reducer';

const getSessionState = createFeatureSelector<SessionState>(
  SESSION_FEATURE_KEY
);

const isDebugOn = createSelector(
  getSessionState,
  (state: SessionState) => state.debug
);
const getTheme = createSelector(
  getSessionState,
  (state: SessionState) => state.theme
);
const showDateGraph = createSelector(
  getSessionState,
  (state: SessionState) => state.showDateGraph
);

export const sessionQuery = {
  isDebugOn,
  getTheme,
  showDateGraph
};
