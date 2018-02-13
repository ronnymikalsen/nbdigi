import { Item } from '../../models/search-result.model';
import { ItemAction, ItemActionTypes } from './../actions/item.actions';

export interface State {
  currentItem?: Item;
}

export const initialState: State = {
  currentItem: null
};

export function reducer(state = initialState, action: ItemAction): State {
  switch (action.type) {
    case ItemActionTypes.Open: {
      return {
        ...state,
        currentItem: action.payload
      };
    }
    default: {
      return state;
    }
  }
}
