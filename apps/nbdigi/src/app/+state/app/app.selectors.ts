import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState, APP_FEATURE_KEY } from './app.reducer';

const getAppState = createFeatureSelector<AppState>(APP_FEATURE_KEY);

const isDebugOn = createSelector(getAppState, (state: AppState) => state.debug);
const getTheme = createSelector(getAppState, (state: AppState) => state.theme);
const showDateGraph = createSelector(
  getAppState,
  (state: AppState) => state.showDateGraph,
);

export const appQuery = {
  isDebugOn,
  getTheme,
  showDateGraph,
};
