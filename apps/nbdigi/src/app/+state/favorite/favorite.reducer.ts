import { FavoriteList } from '../../core/models';
import { FavoriteAction, FavoriteActionTypes } from './favorite.actions';

export const FAVORITE_FEATURE_KEY = 'favorite';

export interface FavoriteState {
  selected: string;
  lists?: FavoriteList[];
}

export interface FavoritePartialState {
  readonly [FAVORITE_FEATURE_KEY]: FavoriteState;
}

export const initialState: FavoriteState = {
  selected: null,
  lists: []
};

export function favoriteReducer(
  state: FavoriteState = initialState,
  action: FavoriteAction
): FavoriteState {
  switch (action.type) {
    case FavoriteActionTypes.OpenList: {
      state = {
        ...state,
        selected: action.payload
      };
      break;
    }
    case FavoriteActionTypes.RemoveListSuccess: {
      const index = state.lists.findIndex(l => l.id === action.payload.id);
      const newLists = [...state.lists];
      newLists.splice(index, 1);
      state = {
        ...state,
        lists: newLists
      };
      break;
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
      state = {
        ...state,
        lists: newLists
      };
      break;
    }
  }
  return state;
}
