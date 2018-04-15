import { FavoriteList } from './../../models/favorite-list';
import { Action } from '@ngrx/store';

import { Item } from '../../models/search-result.model';

export enum FavoriteActionTypes {
  FetchListsSuccess = '[Favorite] Fetch lists success',
  AddList = '[Favorite] Add list',
  AddToList = '[Favorite] Add to list',
  AddToListSuccess = '[Favorite] Add to list success'
}

export class FetchListsSuccess implements Action {
  readonly type = FavoriteActionTypes.FetchListsSuccess;

  constructor(public payload: FavoriteList[]) {}
}

export class AddList implements Action {
  readonly type = FavoriteActionTypes.AddList;

  constructor(public payload: string) {}
}

export class AddToList implements Action {
  readonly type = FavoriteActionTypes.AddToList;

  constructor(public payload: FavoriteList) {}
}

export class AddToListSuccess implements Action {
  readonly type = FavoriteActionTypes.AddToListSuccess;

  constructor() {}
}

export type FavoriteAction =
  | FetchListsSuccess
  | AddList
  | AddToList
  | AddToListSuccess;
