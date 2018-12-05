import { ItemAction, ItemActionTypes } from './item.actions';

export const ITEM_FEATURE_KEY = 'item';

/**
 * Interface for the 'Item' data used in
 *  - ItemState, and
 *  - itemReducer
 *
 *  Note: replace if already defined in another module
 */

/* tslint:disable:no-empty-interface */
export interface Entity {}

export interface ItemState {
  list: Entity[]; // list of Item; analogous to a sql normalized table
  selectedId?: string | number; // which Item record has been selected
  loaded: boolean; // has the Item list been loaded
  error?: any; // last none error (if any)
}

export interface ItemPartialState {
  readonly [ITEM_FEATURE_KEY]: ItemState;
}

export const initialState: ItemState = {
  list: [],
  loaded: false
};

export function itemReducer(
  state: ItemState = initialState,
  action: ItemAction
): ItemState {
  switch (action.type) {
    case ItemActionTypes.ItemLoaded: {
      state = {
        ...state,
        list: action.payload,
        loaded: true
      };
      break;
    }
  }
  return state;
}
