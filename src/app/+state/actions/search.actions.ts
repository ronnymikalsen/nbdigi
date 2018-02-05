import { Hints, Hint } from './../../core/typeahead-service/hints.model';
import { Action } from '@ngrx/store';

export enum SearchActionTypes {
  SetQuery = '[Search] Set query',
  LoadHints = '[Search] Load hints',
  HintsLoaded = '[Search] Hints Loaded',
  AddFilter = '[Search] Add filter',
  RemoveFilter = '[Search] Remove filter',
  ToggleFilter = '[Search] Toggle filter',
}

export class SetQuery implements Action {
  readonly type = SearchActionTypes.SetQuery;

  constructor(public payload: string) { }
}

export class LoadHints implements Action {
  readonly type = SearchActionTypes.LoadHints;

  constructor(public payload: string) { }
}

export class HintsLoaded implements Action {
  readonly type = SearchActionTypes.HintsLoaded;

  constructor(public payload: Hints) { }
}

export class AddFilter implements Action {
  readonly type = SearchActionTypes.AddFilter;

  constructor(public payload: Hint) { }
}

export class RemoveFilter implements Action {
  readonly type = SearchActionTypes.RemoveFilter;

  constructor(public payload: Hint) { }
}

export class ToggleFilter implements Action {
  readonly type = SearchActionTypes.ToggleFilter;

  constructor(public payload: Hint) { }
}

export type SearchAction = SetQuery | LoadHints | HintsLoaded | AddFilter | RemoveFilter | ToggleFilter;
