import { FavoriteList } from './../../models/favorite-list';
import { Action } from '@ngrx/store';

import { Item } from '../../models/search-result.model';

export enum FavoriteActionTypes {
  FetchLists = '[Favorite] Fetch lists',
  FetchListsSuccess = '[Favorite] Fetch lists success',
  AddList = '[Favorite] Add list'
}

export class FetchLists implements Action {
  readonly type = FavoriteActionTypes.FetchLists;

  constructor() {}
}

export class FetchListsSuccess implements Action {
  readonly type = FavoriteActionTypes.FetchListsSuccess;

  constructor(public payload: FavoriteList[]) {}
}

export class AddList implements Action {
  readonly type = FavoriteActionTypes.AddList;

  constructor(public payload: string) {}
}

export type FavoriteAction = FetchLists | FetchListsSuccess | AddList;
