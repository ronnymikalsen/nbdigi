import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as searchAction from '../../../+state/actions/search.actions';
import * as sessionAction from '../../../+state/actions/session.actions';
import * as fromRoot from '../../../+state/reducers';
import * as fromSearch from '../../../+state/reducers/search.reducer';
import { Hint } from '../../../core/models/hints.model';

@Component({
  selector: 'nbd-search-box',
  template: `
    <nbd-search-box-container
      [q]="q | async"
      [hints]="(search | async).hints"
      (searchSelected)="onSearchSelected($event)"
      (query)="query($event)"
      (hintSelected)="addFilter($event)"
      (clearAll)="onClearAll()"
      (debugChanged)="debugChanged($event)"
    >
    </nbd-search-box-container>
  `
})
export class SearchBoxPageComponent {
  @Output() searchSelected = new EventEmitter<string>();
  search: Observable<fromSearch.State> = this.store.select(
    fromRoot.getSearchState
  );
  q: Observable<string> = this.store.select(fromRoot.getQ);

  constructor(private router: Router, private store: Store<fromRoot.State>) {}

  onSearchSelected(query: string): void {
    this.searchSelected.emit(query);
  }

  query(query: string): void {
    this.store.dispatch(new searchAction.LoadHints(query));
  }

  addFilter(filter: Hint): void {
    this.store.dispatch(
      new searchAction.UpdateCriteria({
        q: null
      })
    );
    this.store.dispatch(new searchAction.AddFilter(filter));
    this.store.dispatch(new searchAction.Search());
  }

  onClearAll(): void {
    this.store.dispatch(new searchAction.ClearAll());
    this.store.dispatch(new searchAction.SearchAggs());
    this.router.navigate(['/search']);
  }

  debugChanged(debug: boolean): void {
    debug
      ? this.store.dispatch(new sessionAction.DebugOn())
      : this.store.dispatch(new sessionAction.DebugOff());
  }
}
