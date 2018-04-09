import { Action } from '@ngrx/store';

import {
  SuperSearchResult,
  MediaTypeResults
} from './../../models/search-result.model';
import { Hints, Hint } from './../../core/typeahead-service/hints.model';
import { SearchCriteria } from '../../models/search-criteria.model';
import { Sort } from '../../models/sort-options';
import { Criteria } from '../../models/criteria';

export enum SearchActionTypes {
  Search = '[Search] Searching',
  SearchSuccess = '[Search] Search success',
  SearchError = '[Search] Search error',
  SearchAggs = '[Search] Searching aggs',
  SearchAggsSuccess = '[Search] Search aggs success',
  SearchAggsError = '[Search] Search aggs error',
  LoadHints = '[Search] Load hints',
  HintsLoaded = '[Search] Hints Loaded',
  AddFilter = '[Search] Add filter',
  RemoveFilter = '[Search] Remove filter',
  ToggleFilter = '[Search] Toggle filter',
  LoadMore = '[Search] Load more',
  LoadMoreSuccess = '[Search] Load more success',
  ClearAll = '[Search] Clear all',
  SetCriteria = '[Search] Set criteria',
  UpdateCriteria = '[Search] Update criteria'
}

export class Search implements Action {
  readonly type = SearchActionTypes.Search;
}

export class SearchSuccess implements Action {
  readonly type = SearchActionTypes.SearchSuccess;

  constructor(public payload: SuperSearchResult) {}
}

export class SearchError implements Action {
  readonly type = SearchActionTypes.SearchError;

  constructor(public payload: any) {}
}

export class SearchAggs implements Action {
  readonly type = SearchActionTypes.SearchAggs;
}

export class SearchAggsSuccess implements Action {
  readonly type = SearchActionTypes.SearchAggsSuccess;

  constructor(public payload: SuperSearchResult) {}
}

export class SearchAggsError implements Action {
  readonly type = SearchActionTypes.SearchAggsError;

  constructor(public payload: any) {}
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

export class LoadMoreSuccess implements Action {
  readonly type = SearchActionTypes.LoadMoreSuccess;

  constructor(public payload: SuperSearchResult) {}
}

export class LoadMore implements Action {
  readonly type = SearchActionTypes.LoadMore;
}

export class ClearAll implements Action {
  readonly type = SearchActionTypes.ClearAll;
}

export class SetCriteria implements Action {
  readonly type = SearchActionTypes.SetCriteria;

  constructor(public payload: Criteria) {}
}

export class UpdateCriteria implements Action {
  readonly type = SearchActionTypes.UpdateCriteria;

  constructor(public payload: Criteria) {}
}

export type SearchAction =
  | Search
  | SearchSuccess
  | SearchError
  | SearchAggs
  | SearchAggsSuccess
  | SearchAggsError
  | LoadHints
  | HintsLoaded
  | AddFilter
  | RemoveFilter
  | ToggleFilter
  | LoadMoreSuccess
  | LoadMore
  | ClearAll
  | SetCriteria
  | UpdateCriteria;
