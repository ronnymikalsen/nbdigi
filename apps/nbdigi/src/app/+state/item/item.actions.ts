import { Action } from '@ngrx/store';
import { Item, Manifest } from '../../core/models';

export enum ItemActionTypes {
  Open = '[Item] Open',
  Change = '[Item] Change',
  OpenItemDetails = '[Item] open item details',
  CloseItemDetails = '[Item] close item details',
  LoadSuccess = '[Item] Load item details Success',
  LoadFailure = '[Item] Load item details  Failure'
}

export class Open implements Action {
  readonly type = ItemActionTypes.Open;

  constructor(public payload: Item) {}
}

export class Change implements Action {
  readonly type = ItemActionTypes.Change;

  constructor(public payload: Item) {}
}

export class OpenItemDetails implements Action {
  readonly type = ItemActionTypes.OpenItemDetails;
  constructor(public payload: Item) {}
}

export class CloseItemDetails implements Action {
  readonly type = ItemActionTypes.CloseItemDetails;
  constructor() {}
}

export class LoadItemDetailsSuccess implements Action {
  readonly type = ItemActionTypes.LoadSuccess;

  constructor(public payload: Manifest) {}
}

export class LoadItemDetailsFailure implements Action {
  readonly type = ItemActionTypes.LoadFailure;

  constructor(public payload: string) {}
}

export type ItemAction =
  | Open
  | Change
  | OpenItemDetails
  | CloseItemDetails
  | LoadItemDetailsSuccess
  | LoadItemDetailsFailure;

export const fromItemActions = {
  Open,
  Change,
  OpenItemDetails,
  CloseItemDetails,
  LoadItemDetailsSuccess,
  LoadItemDetailsFailure
};
