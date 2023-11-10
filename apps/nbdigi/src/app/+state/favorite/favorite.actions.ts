import { Action } from '@ngrx/store';
import { FavoriteList, Item } from '../../core/models';

export enum FavoriteActionTypes {
  OpenAddToListDialog = '[Favorite] Open dialog',
  OpenList = '[Favorite] Open list',
  SetList = '[Favorite] Set list',
  FetchListsSuccess = '[Favorite] Fetch lists success',
  AddList = '[Favorite] Add list',
  AddListSuccess = '[Favorite] Add list success',
  AddListCancelled = '[Favorite] Add list cancelled',
  OpenRenameListDialog = '[Favorite] Open rename list dialog',
  RenameList = '[Favorite] Rename list',
  RenameListSuccess = '[Favorite] Rename list success',
  RenameListCancelled = '[Favorite] Rename list cancelled',
  RemoveList = '[Favorite] Remove list',
  RemoveListSuccess = '[Favorite] Remove list success',
  RemoveListConfirmed = '[Favorite] Remove list confirmed',
  RemoveListCancelled = '[Favorite] Remove list cancelled',
  AddToList = '[Favorite] Add to list',
  AddToListSuccess = '[Favorite] Add to list success',
  AddToListCancelled = '[Favorite] Add to list cancelled',
  RemoveFromList = '[Favorite] Remove from list',
  RemoveFromListConfirmed = '[Favorite] Remove from list confirmed',
  RemoveFromListSuccess = '[Favorite] Remove from list success',
  RemoveFromListCancelled = '[Favorite] Remove from list cancelled',
  Error = '[Favorite] Error',
}

export class OpenAddToListDialog implements Action {
  readonly type = FavoriteActionTypes.OpenAddToListDialog;

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

export class OpenRenameListDialog implements Action {
  readonly type = FavoriteActionTypes.OpenRenameListDialog;

  constructor(public payload: FavoriteList) {}
}

export class RenameListCancelled implements Action {
  readonly type = FavoriteActionTypes.RenameListCancelled;

  constructor() {}
}

export class RenameList implements Action {
  readonly type = FavoriteActionTypes.RenameList;

  constructor(
    public payload: {
      favoriteList: FavoriteList;
      newName: string;
    },
  ) {}
}

export class RenameListSuccess implements Action {
  readonly type = FavoriteActionTypes.RenameListSuccess;

  constructor() {}
}

export class RemoveList implements Action {
  readonly type = FavoriteActionTypes.RemoveList;

  constructor(public payload: FavoriteList) {}
}

export class RemoveListConfirmed implements Action {
  readonly type = FavoriteActionTypes.RemoveListConfirmed;

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

export class RemoveFromListConfirmed implements Action {
  readonly type = FavoriteActionTypes.RemoveFromListConfirmed;

  constructor(public payload: FavoriteList) {}
}

export class RemoveFromListSuccess implements Action {
  readonly type = FavoriteActionTypes.RemoveFromListSuccess;

  constructor() {}
}

export class RemoveFromListCancelled implements Action {
  readonly type = FavoriteActionTypes.RemoveFromListCancelled;

  constructor() {}
}

export class Error implements Action {
  readonly type = FavoriteActionTypes.Error;

  constructor(public payload: Error) {}
}

export type FavoriteAction =
  | OpenAddToListDialog
  | OpenList
  | SetList
  | FetchListsSuccess
  | AddList
  | AddListSuccess
  | RenameList
  | RenameListSuccess
  | RenameListCancelled
  | RemoveList
  | RemoveListConfirmed
  | RemoveListSuccess
  | RemoveListCancelled
  | AddToList
  | AddToListSuccess
  | AddToListCancelled
  | RemoveFromList
  | RemoveFromListConfirmed
  | RemoveFromListSuccess
  | RemoveFromListCancelled
  | Error;

export const fromFavoriteActions = {
  OpenAddToListDialog,
  OpenList,
  SetList,
  FetchListsSuccess,
  AddList,
  AddListSuccess,
  RenameList,
  RenameListSuccess,
  RenameListCancelled,
  RemoveList,
  RemoveListConfirmed,
  RemoveListSuccess,
  RemoveListCancelled,
  AddToList,
  AddToListSuccess,
  AddToListCancelled,
  RemoveFromList,
  RemoveFromListConfirmed,
  RemoveFromListSuccess,
  RemoveFromListCancelled,
  Error,
};
