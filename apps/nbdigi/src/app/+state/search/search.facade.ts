import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Criteria, DateOption, Hint } from '../../core/models';
import { ChartRangeToOption } from '../../search/components/search-result-chart/chart-strategy-factory';
import {
  AddFilter,
  ClearAll,
  LoadHints,
  LoadMore,
  RemoveFilter,
  Search,
  SearchAggs,
  SetCriteria,
  SetCurrentChartName,
  SetDateCriteria,
  ToChartRange,
  ToggleFilter,
  UpdateCriteria,
} from './search.actions';
import { SearchPartialState } from './search.reducer';
import { searchQuery } from './search.selectors';

@Injectable()
export class SearchFacade {
  state$ = this.store.pipe(select(searchQuery.getSearchState));
  getQ$ = this.store.pipe(select(searchQuery.getQ));
  getCriteria$ = this.store.pipe(select(searchQuery.getCriteria));
  getBooks$ = this.store.pipe(select(searchQuery.getBooks));
  getNewspapers$ = this.store.pipe(select(searchQuery.getNewspapers));
  getPhotos$ = this.store.pipe(select(searchQuery.getPhotos));
  getPeriodicals$ = this.store.pipe(select(searchQuery.getPeriodicals));
  getMaps$ = this.store.pipe(select(searchQuery.getMaps));
  getMusicBooks$ = this.store.pipe(select(searchQuery.getMusicBooks));
  getMusicManuscripts$ = this.store.pipe(
    select(searchQuery.getMusicManuscripts),
  );
  getPosters$ = this.store.pipe(select(searchQuery.getPosters));
  getPrivateArchives$ = this.store.pipe(select(searchQuery.getPrivateArchives));
  getProgramReports$ = this.store.pipe(select(searchQuery.getProgramReports));
  getOthers$ = this.store.pipe(select(searchQuery.getOthers));
  getMoreUrl$ = this.store.pipe(select(searchQuery.getMoreUrl));
  getCurrentMediaTypeCount$ = this.store.pipe(
    select(searchQuery.getCurrentMediaTypeCount),
  );
  getYears$ = this.store.pipe(select(searchQuery.getYears));
  getMonths$ = this.store.pipe(select(searchQuery.getMonths));
  pristine$ = this.store.pipe(select(searchQuery.pristine));

  constructor(private store: Store<SearchPartialState>) {}

  setCriteria(criteria: Criteria): void {
    this.store.dispatch(new SetCriteria(criteria));
  }

  updateCriteria(criteria: Criteria): any {
    this.store.dispatch(new UpdateCriteria(criteria));
  }

  search(): void {
    this.store.dispatch(new Search());
  }

  searchAggs(): any {
    this.store.dispatch(new SearchAggs());
  }

  toggleFilter(hint: Hint): any {
    this.store.dispatch(new ToggleFilter(hint));
  }

  addFilter(hint: Hint): any {
    this.store.dispatch(new AddFilter(hint));
  }

  removeFilter(hint: Hint): any {
    this.store.dispatch(new RemoveFilter(hint));
  }

  setDateCriteria(dateOption: DateOption): any {
    this.store.dispatch(new SetDateCriteria(dateOption));
  }

  setCurrentChartName(name: string): any {
    this.store.dispatch(new SetCurrentChartName(name));
  }

  toChartRange(chartBackOption: ChartRangeToOption): any {
    this.store.dispatch(new ToChartRange(chartBackOption));
  }

  loadMore(): any {
    this.store.dispatch(new LoadMore());
  }

  loadHints(query: string): any {
    this.store.dispatch(new LoadHints(query));
  }

  clearAll(): any {
    this.store.dispatch(new ClearAll());
  }
}
