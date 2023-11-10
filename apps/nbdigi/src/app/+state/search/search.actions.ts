import { Action } from '@ngrx/store';
import {
  Criteria,
  DateOption,
  Hint,
  Hints,
  SuperSearchResult,
} from '../../core/models';
import { ChartRangeToOption } from '../../search/components/search-result-chart/chart-strategy-factory';

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
  UpdateCriteria = '[Search] Update criteria',
  OpenDatePickerDialog = '[Search] Open date dialog',
  SetDateCriteria = '[Search] Set date criteria',
  SetDateCriteriaConfirmed = '[Search] Set date criteria confimred',
  SetDateCriteriaCancelled = '[Search] Set date criteria cancelled',
  ToChartRange = '[Search] Go back to previous chart range',
  SetCurrentChartRange = '[Search] Set current chart range',
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

export class OpenDatePickerDialog implements Action {
  readonly type = SearchActionTypes.OpenDatePickerDialog;

  constructor() {}
}

export class SetDateCriteria implements Action {
  readonly type = SearchActionTypes.SetDateCriteria;

  constructor(public payload: DateOption) {}
}

export class SetDateCriteriaConfirmed implements Action {
  readonly type = SearchActionTypes.SetDateCriteriaConfirmed;

  constructor(public payload: DateOption) {}
}

export class SetDateCriteriaCancelled implements Action {
  readonly type = SearchActionTypes.SetDateCriteriaCancelled;

  constructor() {}
}
export class ToChartRange implements Action {
  readonly type = SearchActionTypes.ToChartRange;

  constructor(public payload: ChartRangeToOption) {}
}

export class SetCurrentChartName implements Action {
  readonly type = SearchActionTypes.SetCurrentChartRange;

  constructor(public payload: string) {}
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
  | UpdateCriteria
  | OpenDatePickerDialog
  | SetDateCriteria
  | SetDateCriteriaConfirmed
  | SetDateCriteriaCancelled
  | ToChartRange
  | SetCurrentChartName;

export const fromSearchActions = {
  Search,
  SearchSuccess,
  SearchError,
  SearchAggs,
  SearchAggsSuccess,
  SearchAggsError,
  LoadHints,
  HintsLoaded,
  AddFilter,
  RemoveFilter,
  ToggleFilter,
  LoadMoreSuccess,
  LoadMore,
  ClearAll,
  SetCriteria,
  UpdateCriteria,
  OpenDatePickerDialog,
  SetDateCriteria,
  SetDateCriteriaConfirmed,
  SetDateCriteriaCancelled,
  ToChartRange,
  SetCurrentChartName,
};
