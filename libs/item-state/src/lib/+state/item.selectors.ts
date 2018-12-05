import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ITEM_FEATURE_KEY, ItemState } from './item.reducer';

// Lookup the 'Item' feature state managed by NgRx
const getItemState = createFeatureSelector<ItemState>(ITEM_FEATURE_KEY);

const getLoaded = createSelector(
  getItemState,
  (state: ItemState) => state.loaded
);
const getError = createSelector(
  getItemState,
  (state: ItemState) => state.error
);

const getAllItem = createSelector(
  getItemState,
  getLoaded,
  (state: ItemState, isLoaded) => {
    return isLoaded ? state.list : [];
  }
);
const getSelectedId = createSelector(
  getItemState,
  (state: ItemState) => state.selectedId
);
const getSelectedItem = createSelector(
  getAllItem,
  getSelectedId,
  (item, id) => {
    const result = item.find(it => it['id'] === id);
    return result ? Object.assign({}, result) : undefined;
  }
);

export const itemQuery = {
  getLoaded,
  getError,
  getAllItem,
  getSelectedItem
};
