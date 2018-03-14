import { Action } from '@ngrx/store';

import { Item } from '../../models/search-result.model';

export enum ItemActionTypes {
  Open = '[Viewer] Open',
  Change = '[Viewer] Change'
}

export class Open implements Action {
  readonly type = ItemActionTypes.Open;

  constructor(public payload: Item) {}
}

export class Change implements Action {
  readonly type = ItemActionTypes.Change;

  constructor(public payload: Item) {}
}

export type ItemAction = Open | Change;
