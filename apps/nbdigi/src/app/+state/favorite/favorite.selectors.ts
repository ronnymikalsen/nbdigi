import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FavoriteState, FAVORITE_FEATURE_KEY } from './favorite.reducer';

const getFavoriteState =
  createFeatureSelector<FavoriteState>(FAVORITE_FEATURE_KEY);

const getSelectedList = createSelector(
  getFavoriteState,
  (state: FavoriteState) =>
    state.lists.filter((l) => l.id === state.selected)[0],
);
const getLists = createSelector(
  getFavoriteState,
  (state: FavoriteState) => state.lists,
);

export const favoriteQuery = {
  getSelectedList,
  getLists,
};
