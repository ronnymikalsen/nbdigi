import {
  FavoriteActionUnion,
  FavoriteActionTypes
} from '../actions/favorite.actions';
import { FavoriteList } from '@nbdigi/data-models';

export interface State {
  selected: string;
  lists?: FavoriteList[];
}

export const initialState: State = {
  selected: null,
  lists: []
};

export function reducer(
  state = initialState,
  action: FavoriteActionUnion
): State {
  switch (action.type) {
    case FavoriteActionTypes.OpenList: {
      return {
        ...state,
        selected: action.payload
      };
    }
    case FavoriteActionTypes.RemoveListSuccess: {
      const index = state.lists.findIndex(l => l.id === action.payload.id);
      const newLists = [...state.lists];
      newLists.splice(index, 1);
      return {
        ...state,
        lists: newLists
      };
    }
    case FavoriteActionTypes.SetList: {
      const payload = { ...action.payload };
      const items = [...payload.items];
      items.sort(
        (a, b) =>
          (b.timestamp ? b.timestamp.toMillis() : 0) -
          (a.timestamp ? a.timestamp.toMillis() : 0)
      );
      payload.items = items;
      const newLists = [...state.lists];
      const foundIndex = newLists.findIndex(
        element => element.id === payload.id
      );
      if (foundIndex !== -1) {
        newLists.splice(foundIndex, 1, payload);
      } else {
        newLists.push(payload);
      }

      newLists.sort((a, b) => a.name.localeCompare(b.name));
      return {
        ...state,
        lists: newLists
      };
    }
    default: {
      return state;
    }
  }
}

export const getSelectedList = (state: State) =>
  state.lists.filter(l => l.id === state.selected)[0];
export const getLists = (state: State) => state.lists;
