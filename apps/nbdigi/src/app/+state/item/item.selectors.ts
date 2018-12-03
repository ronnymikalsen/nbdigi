import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ItemState, ITEM_FEATURE_KEY } from './item.reducer';

const getItemState = createFeatureSelector<ItemState>(ITEM_FEATURE_KEY);

const getCurrentItem = createSelector(
  getItemState,
  (state: ItemState) => state.currentItem
);
const getCurrentItemDetails = createSelector(
  getItemState,
  (state: ItemState) => state.currentItemDetails
);
const getCurrentItemDetailsManifest = createSelector(
  getItemState,
  (state: ItemState) => state.currentItemDetailsManifest
);
const getLoading = createSelector(
  getItemState,
  (state: ItemState) => state.loading
);
const showItemDetails = createSelector(
  getItemState,
  (state: ItemState) => state.showItemDetails
);

export const itemQuery = {
  getCurrentItem,
  getCurrentItemDetails,
  getCurrentItemDetailsManifest,
  getLoading,
  showItemDetails
};
