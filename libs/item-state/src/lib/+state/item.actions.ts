import { Item, Manifest } from '@nbdigi/data-models';
import { Action } from '@ngrx/store';

export enum ItemActionTypes {
  Open = '[Viewer] Open',
  Change = '[Viewer] Change',
  OpenItemDetails = '[Search] open item details',
  CloseItemDetails = '[Search] close item details',
  LoadSuccess = '[Presentation/API] Load Success',
  LoadFailure = '[Presentation/API] Load Failure'
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

export class LoadSuccess implements Action {
  readonly type = ItemActionTypes.LoadSuccess;

  constructor(public payload: Manifest) {}
}

export class LoadFailure implements Action {
  readonly type = ItemActionTypes.LoadFailure;

  constructor(public payload: string) {}
}

export type ItemAction =
  | Open
  | Change
  | OpenItemDetails
  | CloseItemDetails
  | LoadSuccess
  | LoadFailure;
export const fromItemActions = {
  Open,
  Change,
  OpenItemDetails,
  CloseItemDetails,
  LoadSuccess,
  LoadFailure
};
