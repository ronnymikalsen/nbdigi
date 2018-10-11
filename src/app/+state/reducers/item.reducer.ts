import { Manifest } from '../../core/presentation-service/manifest';
import { Item } from '../../models/search-result.model';
import { ItemActions, PresentationApiActions } from '../actions';
import { ItemActionTypes } from '../actions/item.actions';

export interface State {
  currentItem?: Item;
  currentManifest: Manifest;
  loading: boolean;
  showItemDetails: boolean;
}

export const initialState: State = {
  currentItem: null,
  currentManifest: null,
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
        currentItem: action.payload
      };
    }
    case ItemActionTypes.CloseItemDetails: {
      return {
        ...state,
        showItemDetails: false
      };
    }
    case PresentationApiActions.PresentationApiActionTypes.LoadSuccess: {
      return {
        ...state,
        loading: false,
        currentManifest: action.payload
      };
    }
    case PresentationApiActions.PresentationApiActionTypes.LoadFailure: {
      return {
        ...state,
        loading: false,
        currentManifest: null
      };
    }
    default: {
      return state;
    }
  }
}

export const getCurrentItem = (state: State) => state.currentItem;
export const getCurrentManifest = (state: State) => state.currentManifest;
export const getLoading = (state: State) => state.loading;
export const showItemDetails = (state: State) => state.showItemDetails;
