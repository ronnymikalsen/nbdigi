import { Action } from '@ngrx/store';

import {
  SuperSearchResult,
  MediaTypeResults
} from './../../models/search-result.model';
import { Hints, Hint } from './../../core/typeahead-service/hints.model';

export enum SearchActionTypes {
  Search = '[Search] Searching',
  SearchSuccess = '[Search] Search success',
  SetQuery = '[Search] Set query',
  LoadHints = '[Search] Load hints',
  HintsLoaded = '[Search] Hints Loaded',
  AddFilter = '[Search] Add filter',
  RemoveFilter = '[Search] Remove filter',
  ToggleFilter = '[Search] Toggle filter',
  SetMediaType = '[Search] Set media type',
  LoadMore = '[Search] Load more',
  LoadMoreSuccess = '[Search] Load more success',
}

export class Search implements Action {
  readonly type = SearchActionTypes.Search;
}

export class SearchSuccess implements Action {
  readonly type = SearchActionTypes.SearchSuccess;

  constructor(public payload: SuperSearchResult) {}
}

export class SetQuery implements Action {
  readonly type = SearchActionTypes.SetQuery;

  constructor(public payload: string) {}
}

export class LoadHints implements Action {
  readonly type = SearchActionTypes.LoadHints;

  constructor(public payload: string) {}
}

export class HintsLoaded implements Action {
  readonly type = SearchActionTypes.HintsLoaded;

  constructor(public payload: Hints) {}
}

export class AddFilter implements Action {
  readonly type = SearchActionTypes.AddFilter;

  constructor(public payload: Hint) {}
}

export class RemoveFilter implements Action {
  readonly type = SearchActionTypes.RemoveFilter;

  constructor(public payload: Hint) {}
}

export class ToggleFilter implements Action {
  readonly type = SearchActionTypes.ToggleFilter;

  constructor(public payload: Hint) {}
}

export class SetMediaType implements Action {
  readonly type = SearchActionTypes.SetMediaType;

  constructor(public payload: string) {}
}

export class LoadMoreSuccess implements Action {
  readonly type = SearchActionTypes.LoadMoreSuccess;

  constructor(public payload: SuperSearchResult) {}
}

export class LoadMore implements Action {
  readonly type = SearchActionTypes.LoadMore;
}

export type SearchAction =
  | Search
  | SearchSuccess
  | SetQuery
  | LoadHints
  | HintsLoaded
  | AddFilter
  | RemoveFilter
  | ToggleFilter
  | SetMediaType
  | LoadMoreSuccess
  | LoadMore;
