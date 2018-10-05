import { Item } from '../../models/search-result.model';
import { ItemAction, ItemActionTypes } from '../actions/item.actions';

export interface State {
  currentItem?: Item;
  showItemDetails: boolean;
}

export const initialState: State = {
  currentItem: null,
  showItemDetails: false
};

export function reducer(state = initialState, action: ItemAction): State {
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
        showItemDetails: true
      };
    }
    case ItemActionTypes.CloseItemDetails: {
      return {
        ...state,
        showItemDetails: false
      };
    }
    default: {
      return state;
    }
  }
}

export const getCurrentItem = (state: State) => state.currentItem;
export const showItemDetails = (state: State) => state.showItemDetails;
