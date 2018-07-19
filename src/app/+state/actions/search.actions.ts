import { Action } from '@ngrx/store';
import { Hint, Hints } from '../../core/typeahead-service/hints.model';
import { ChartOption } from '../../models/char-option';
import { Criteria } from '../../models/criteria';
import { DateOption } from '../../models/date-options';
import { SuperSearchResult } from '../../models/search-result.model';

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
  SetChartRange = '[Search] Set chartRange',
  SetCenturyChartRange = '[Search] Set century chart range',
  SetYearChartRange = '[Search] Set year chart range',
  SetMonthChartRange = '[Search] Set month chart range',
  SetDayChartRange = '[Search] Set day chart range',
  PreviousChartRange = '[Search] Previous chart range'
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

export class SetCenturyChartRange implements Action {
  readonly type = SearchActionTypes.SetCenturyChartRange;

  constructor(public payload: ChartOption) {}
}
export class SetYearChartRange implements Action {
  readonly type = SearchActionTypes.SetYearChartRange;

  constructor(public payload: ChartOption) {}
}
export class SetMonthChartRange implements Action {
  readonly type = SearchActionTypes.SetMonthChartRange;

  constructor(public payload: ChartOption) {}
}

export class SetDayChartRange implements Action {
  readonly type = SearchActionTypes.SetDayChartRange;

  constructor(public payload: ChartOption) {}
}
export class SetChartRange implements Action {
  readonly type = SearchActionTypes.SetChartRange;

  constructor(public payload: ChartOption) {}
}

export class PreviousChartRange implements Action {
  readonly type = SearchActionTypes.PreviousChartRange;

  constructor() {}
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
  | SetCenturyChartRange
  | SetYearChartRange
  | SetMonthChartRange
  | SetDayChartRange
  | PreviousChartRange
  | SetChartRange
  | SetDateCriteriaCancelled;
