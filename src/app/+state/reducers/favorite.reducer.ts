import { FavoriteList } from './../../models/favorite-list';
import {
  FavoriteAction,
  FavoriteActionTypes
} from './../actions/favorite.actions';
import { User } from './../../models/user.model';
import { AuthError as AuthErrorModel } from './../../models/auth-error.model';

export interface State {
  lists?: FavoriteList[];
}

export const initialState: State = {
  lists: null
};

export function reducer(state = initialState, action: FavoriteAction): State {
  switch (action.type) {
    case FavoriteActionTypes.FetchListsSuccess: {
      return {
        ...state,
        lists: [...action.payload]
      };
    }
    default: {
      return state;
    }
  }
}
