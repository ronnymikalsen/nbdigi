import { FavoriteList } from './../../models/favorite-list';
import { Action } from '@ngrx/store';

import { Item } from '../../models/search-result.model';

export enum FavoriteActionTypes {
  OpenDialog = '[Favorite] Open dialog',
  OpenList = '[Favorite] Open list',
  SetList = '[Favorite] Set list',
  FetchListsSuccess = '[Favorite] Fetch lists success',
  AddList = '[Favorite] Add list',
  AddListSuccess = '[Favorite] Add list success',
  AddListCancelled = '[Favorite] Add list cancelled',
  RenameList = '[Favorite] Rename list',
  RenameListSuccess = '[Favorite] Rename list success',
  RenameListCancelled = '[Favorite] Rename list cancelled',
  RemoveList = '[Favorite] Remove list',
  RemoveListSuccess = '[Favorite] Remove list success',
  RemoveListCancelled = '[Favorite] Remove list cancelled',
  AddToList = '[Favorite] Add to list',
  AddToListSuccess = '[Favorite] Add to list success',
  AddToListCancelled = '[Favorite] Add to list cancelled',
  RemoveFromList = '[Favorite] Remove from list',
  RemoveFromListSuccess = '[Favorite] Remove from list success',
  Error = '[Favorite] Error'
}

export class OpenDialog implements Action {
  readonly type = FavoriteActionTypes.OpenDialog;

  constructor(public payload: Item) {}
}

export class OpenList implements Action {
  readonly type = FavoriteActionTypes.OpenList;

  constructor(public payload: string) {}
}

export class SetList implements Action {
  readonly type = FavoriteActionTypes.SetList;

  constructor(public payload: FavoriteList) {}
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

export class RenameListCancelled implements Action {
  readonly type = FavoriteActionTypes.RenameListCancelled;

  constructor() {}
}

export class RenameList implements Action {
  readonly type = FavoriteActionTypes.RenameList;

  constructor(public payload: FavoriteList) {}
}

export class RenameListSuccess implements Action {
  readonly type = FavoriteActionTypes.RenameListSuccess;

  constructor() {}
}

export class RemoveList implements Action {
  readonly type = FavoriteActionTypes.RemoveList;

  constructor(public payload: FavoriteList) {}
}

export class RemoveListSuccess implements Action {
  readonly type = FavoriteActionTypes.RemoveListSuccess;

  constructor(public payload: FavoriteList) {}
}

export class RemoveListCancelled implements Action {
  readonly type = FavoriteActionTypes.RemoveListCancelled;

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

export class AddToListCancelled implements Action {
  readonly type = FavoriteActionTypes.AddListCancelled;

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
  readonly type = FavoriteActionTypes.Error;

  constructor(public payload: Error) {}
}

export type FavoriteAction =
  | OpenDialog
  | OpenList
  | SetList
  | FetchListsSuccess
  | AddList
  | AddListSuccess
  | RenameList
  | RenameListSuccess
  | RenameListCancelled
  | RemoveList
  | RemoveListSuccess
  | RemoveListCancelled
  | AddToList
  | AddToListSuccess
  | AddToListCancelled
  | RemoveFromList
  | RemoveFromListSuccess
  | Error;
