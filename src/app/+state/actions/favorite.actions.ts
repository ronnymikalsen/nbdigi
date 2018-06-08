import { FavoriteList } from './../../models/favorite-list';
import { Action } from '@ngrx/store';

import { Item } from '../../models/search-result.model';

export enum FavoriteActionTypes {
  OpenDialog = '[Favorite] Open dialog',
  FetchListsSuccess = '[Favorite] Fetch lists success',
  AddList = '[Favorite] Add list',
  AddListSuccess = '[Favorite] Add list success',
  AddToList = '[Favorite] Add to list',
  AddToListSuccess = '[Favorite] Add to list success',
  RemoveFromList = '[Favorite] Remove from list',
  RemoveFromListSuccess = '[Favorite] Remove from list success',
  Error = '[Favorite] Error'
}

export class OpenDialog implements Action {
  readonly type = FavoriteActionTypes.OpenDialog;

  constructor(public payload: Item) {}
}

export class FetchListsSuccess implements Action {
  readonly type = FavoriteActionTypes.FetchListsSuccess;

  constructor(public payload: FavoriteList[]) {}
}

export class AddList implements Action {
  readonly type = FavoriteActionTypes.AddList;

  constructor(public payload: string) {}
}

export class AddListSuccess implements Action {
  readonly type = FavoriteActionTypes.AddListSuccess;

  constructor() {}
}

export class AddToList implements Action {
  readonly type = FavoriteActionTypes.AddToList;

  constructor(public payload: FavoriteList) {}
}

export class AddToListSuccess implements Action {
  readonly type = FavoriteActionTypes.AddToListSuccess;

  constructor() {}
}

export class RemoveFromList implements Action {
  readonly type = FavoriteActionTypes.RemoveFromList;

  constructor(public payload: FavoriteList) {}
}

export class RemoveFromListSuccess implements Action {
  readonly type = FavoriteActionTypes.RemoveFromListSuccess;

  constructor() {}
}

export class Error implements Action {
  readonly type = FavoriteActionTypes.AddToListSuccess;

  constructor() {}
}

export type FavoriteAction =
  | OpenDialog
  | FetchListsSuccess
  | AddList
  | AddListSuccess
  | AddToList
  | AddToListSuccess
  | RemoveFromList
  | RemoveFromListSuccess
  | Error;
