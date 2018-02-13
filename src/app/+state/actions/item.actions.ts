import { Action } from '@ngrx/store';

import { Item } from '../../models/search-result.model';

export enum ItemActionTypes {
  Open = '[Viewer] Open'
}

export class Open implements Action {
  readonly type = ItemActionTypes.Open;

  constructor(public payload: Item) {}
}

export type ItemAction = Open;
