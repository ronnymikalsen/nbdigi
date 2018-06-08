import { FavoriteList } from './../../models/favorite-list';
import {
  FavoriteAction,
  FavoriteActionTypes
} from './../actions/favorite.actions';
import { User } from './../../models/user.model';
import { AuthError as AuthErrorModel } from './../../models/auth-error.model';

export interface State {
  selected: string;
  lists?: FavoriteList[];
}

export const initialState: State = {
  selected: null,
  lists: []
};

export function reducer(state = initialState, action: FavoriteAction): State {
  switch (action.type) {
    case FavoriteActionTypes.OpenList: {
      return {
        ...state,
        selected: action.payload
      };
    }
    case FavoriteActionTypes.SetList: {
      const newList = [...state.lists];
      const foundIndex = newList.findIndex(
        element => element.id === action.payload.id
      );
      if (foundIndex !== -1) {
        newList.splice(foundIndex, 1, action.payload);
      } else {
        newList.push(action.payload);
      }

      newList.sort((a, b) => a.name.localeCompare(b.name));
      return {
        ...state,
        lists: newList
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
