import { Action } from '@ngrx/store';

import { Item, MediaTypeResults } from '../../models/search-result.model';

export enum HomeActionTypes {
  LoadNewBooks = '[Home] Load new books',
  LoadNewBooksSuccess = '[Home] Load new books success',
  LoadNewPeriodicals = '[Home] Load new periodicals',
  LoadNewPeriodicalsSuccess = '[Home] Load new periodicals success',
  LoadNewPhotos = '[Home] Load new photos',
  LoadNewPhotosSuccess = '[Home] Load new photos success',
  LoadError = '[Home] Error loading'
}

export class LoadNewBooks implements Action {
  readonly type = HomeActionTypes.LoadNewBooks;
}

export class LoadNewBooksSuccess implements Action {
  readonly type = HomeActionTypes.LoadNewBooksSuccess;

  constructor(public payload: MediaTypeResults) {}
}

export class LoadNewPeriodicals implements Action {
  readonly type = HomeActionTypes.LoadNewPeriodicals;
}

export class LoadNewPeriodicalsSuccess implements Action {
  readonly type = HomeActionTypes.LoadNewPeriodicalsSuccess;

  constructor(public payload: MediaTypeResults) {}
}

export class LoadNewPhotos implements Action {
  readonly type = HomeActionTypes.LoadNewPhotos;
}

export class LoadNewPhotosSuccess implements Action {
  readonly type = HomeActionTypes.LoadNewPhotosSuccess;

  constructor(public payload: MediaTypeResults) {}
}

export class LoadError implements Action {
  readonly type = HomeActionTypes.LoadError;

  constructor(public payload: any) {}
}

export type HomeAction =
  | LoadNewBooks
  | LoadNewBooksSuccess
  | LoadNewPeriodicals
  | LoadNewPeriodicalsSuccess
  | LoadNewPhotos
  | LoadNewPhotosSuccess
  | LoadError;
