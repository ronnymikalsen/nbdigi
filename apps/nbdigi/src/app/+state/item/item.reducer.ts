import { Item, Manifest } from '../../core/models';
import { ItemAction, ItemActionTypes } from './item.actions';

export const ITEM_FEATURE_KEY = 'item';

export interface ItemState {
  currentItem?: Item | undefined;
  currentItemDetails?: Item | undefined;
  currentItemDetailsManifest: Manifest | undefined;
  loading: boolean;
  showItemDetails: boolean;
}

export interface ItemPartialState {
  readonly [ITEM_FEATURE_KEY]: ItemState;
}

export const initialState: ItemState = {
  currentItem: undefined,
  currentItemDetails: undefined,
  currentItemDetailsManifest: undefined,
  loading: false,
  showItemDetails: false,
};

export function itemReducer(
  state: ItemState = initialState,
  action: ItemAction
): ItemState {
  switch (action.type) {
    case ItemActionTypes.Open: {
      state = {
        ...state,
        currentItem: action.payload,
      };
      break;
    }
    case ItemActionTypes.OpenItemDetails: {
      state = {
        ...state,
        showItemDetails: true,
        currentItemDetails: action.payload,
      };
      break;
    }
    case ItemActionTypes.CloseItemDetails: {
      state = {
        ...state,
        showItemDetails: false,
        currentItemDetails: undefined,
      };
      break;
    }
    case ItemActionTypes.LoadSuccess: {
      state = {
        ...state,
        loading: false,
        currentItemDetailsManifest: action.payload,
      };
      break;
    }
    case ItemActionTypes.LoadFailure: {
      state = {
        ...state,
        loading: false,
        currentItemDetailsManifest: undefined,
      };
      break;
    }
  }
  return state;
}
