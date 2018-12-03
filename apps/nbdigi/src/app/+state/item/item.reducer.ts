import { Item, Manifest } from '../../core/models';
import { ItemAction, ItemActionTypes } from './item.actions';

export const ITEM_FEATURE_KEY = 'item';

export interface ItemState {
  currentItem?: Item;
  currentItemDetails?: Item;
  currentItemDetailsManifest: Manifest;
  loading: boolean;
  showItemDetails: boolean;
}

export interface ItemPartialState {
  readonly [ITEM_FEATURE_KEY]: ItemState;
}

export const initialState: ItemState = {
  currentItem: null,
  currentItemDetails: null,
  currentItemDetailsManifest: null,
  loading: false,
  showItemDetails: false
};

export function itemReducer(
  state: ItemState = initialState,
  action: ItemAction
): ItemState {
  switch (action.type) {
    case ItemActionTypes.Open: {
      state = {
        ...state,
        currentItem: action.payload
      };
      break;
    }
    case ItemActionTypes.OpenItemDetails: {
      state = {
        ...state,
        showItemDetails: true,
        currentItemDetails: action.payload
      };
      break;
    }
    case ItemActionTypes.CloseItemDetails: {
      state = {
        ...state,
        showItemDetails: false,
        currentItemDetails: null
      };
      break;
    }
    case ItemActionTypes.LoadSuccess: {
      state = {
        ...state,
        loading: false,
        currentItemDetailsManifest: action.payload
      };
      break;
    }
    case ItemActionTypes.LoadFailure: {
      state = {
        ...state,
        loading: false,
        currentItemDetailsManifest: null
      };
      break;
    }
  }
  return state;
}
