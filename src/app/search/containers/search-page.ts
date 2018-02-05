import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromRoot from './../../+state/reducers';
import * as fromSearch from './../../+state/reducers/search.reducer';
import * as search from './../../+state/actions/search.actions';
import { Hint } from './../../core/typeahead-service/hints.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-search
      [search]="search | async"
      (query)="query($event)"
      (addFilter)="addFilter($event)"
      (removeFilter)="removeFilter($event)"
      (toggleFilter)="toggleFilter($event)">
    </app-search>
  `
})
export class SearchPageComponent {
  search: Observable<fromSearch.State> = this.store.select(fromRoot.getSearchState);

  constructor(private store: Store<fromRoot.State>) { }


  query(query: string): void {
    this.store.dispatch(new search.LoadHints(query));
    this.store.dispatch(new search.SetQuery(query));
    this.store.dispatch(new search.Search());
  }

  toggleFilter(filter: Hint): void {
    this.store.dispatch(new search.ToggleFilter(filter));
    this.store.dispatch(new search.Search());
  }

  removeFilter(filter: Hint): void {
    this.store.dispatch(new search.RemoveFilter(filter));
    this.store.dispatch(new search.Search());
  }

  addFilter(filter: Hint): void {
    this.store.dispatch(new search.AddFilter(filter));
    this.store.dispatch(new search.Search());
  }

}
