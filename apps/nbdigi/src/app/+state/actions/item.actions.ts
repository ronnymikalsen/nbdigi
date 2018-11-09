import { Item } from '@nbdigi/data-models';
import { Action } from '@ngrx/store';

export enum ItemActionTypes {
  Open = '[Viewer] Open',
  Change = '[Viewer] Change',
  OpenItemDetails = '[Search] open item details',
  CloseItemDetails = '[Search] close item details'
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

export type ItemActionsUnion =
  | Open
  | Change
  | OpenItemDetails
  | CloseItemDetails;
