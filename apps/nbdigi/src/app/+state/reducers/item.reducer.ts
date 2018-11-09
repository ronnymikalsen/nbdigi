import { Item } from '@nbdigi/data-models';
import { Manifest } from '../../core/presentation-service/manifest';
import { ItemActions, PresentationApiActions } from '../actions';
import { ItemActionTypes } from '../actions/item.actions';

export interface State {
  currentItem?: Item;
  currentItemDetails?: Item;
  currentItemDetailsManifest: Manifest;
  loading: boolean;
  showItemDetails: boolean;
}

export const initialState: State = {
  currentItem: null,
  currentItemDetails: null,
  currentItemDetailsManifest: null,
  loading: false,
  showItemDetails: false
};

export function reducer(
  state = initialState,
  action:
    | ItemActions.ItemActionsUnion
    | PresentationApiActions.PresentationApiActionsUnion
): State {
  switch (action.type) {
    case ItemActionTypes.Open: {
      return {
        ...state,
        currentItem: action.payload
      };
    }
    case ItemActionTypes.OpenItemDetails: {
      return {
        ...state,
        showItemDetails: true,
        currentItemDetails: action.payload
      };
    }
    case ItemActionTypes.CloseItemDetails: {
      return {
        ...state,
        showItemDetails: false,
        currentItemDetails: null
      };
    }
    case PresentationApiActions.PresentationApiActionTypes.LoadSuccess: {
      return {
        ...state,
        loading: false,
        currentItemDetailsManifest: action.payload
      };
    }
    case PresentationApiActions.PresentationApiActionTypes.LoadFailure: {
      return {
        ...state,
        loading: false,
        currentItemDetailsManifest: null
      };
    }
    default: {
      return state;
    }
  }
}

export const getCurrentItem = (state: State) => state.currentItem;
export const getCurrentItemDetails = (state: State) => state.currentItemDetails;
export const getCurrentItemDetailsManifest = (state: State) =>
  state.currentItemDetailsManifest;
export const getLoading = (state: State) => state.loading;
export const showItemDetails = (state: State) => state.showItemDetails;
