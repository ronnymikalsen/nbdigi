import { createFeatureSelector, createSelector } from '@ngrx/store';
import { HomeState, HOME_FEATURE_KEY } from './home.reducer';

const getHomeState = createFeatureSelector<HomeState>(HOME_FEATURE_KEY);

const getNewBooks = createSelector(
  getHomeState,
  (state: HomeState) => state.books,
);
const getNewPeriodicals = createSelector(
  getHomeState,
  (state: HomeState) => state.periodicals,
);
const getNewPhotos = createSelector(
  getHomeState,
  (state: HomeState) => state.photos,
);
const getNewNewspapers = createSelector(
  getHomeState,
  (state: HomeState) => state.newspapers,
);
const getNewOthers = createSelector(
  getHomeState,
  (state: HomeState) => state.others,
);

export const homeQuery = {
  getNewBooks,
  getNewPeriodicals,
  getNewPhotos,
  getNewNewspapers,
  getNewOthers,
};
