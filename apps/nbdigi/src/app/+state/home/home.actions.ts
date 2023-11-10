import { Action } from '@ngrx/store';
import { SuperSearchResult } from '../../core/models';

export enum HomeActionTypes {
  LoadNewItems = '[Home] Load new items',
  LoadNewItemsSuccess = '[Home] Load new items success',
  LoadError = '[Home] Error loading',
}

export class LoadNewItems implements Action {
  readonly type = HomeActionTypes.LoadNewItems;
}

export class LoadNewItemsSuccess implements Action {
  readonly type = HomeActionTypes.LoadNewItemsSuccess;

  constructor(public payload: SuperSearchResult) {}
}

export class LoadError implements Action {
  readonly type = HomeActionTypes.LoadError;

  constructor(public payload: any) {}
}

export type HomeAction = LoadNewItems | LoadNewItemsSuccess | LoadError;

export const fromHomeActions = {
  LoadNewItems,
  LoadNewItemsSuccess,
  LoadError,
};
