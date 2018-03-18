import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter
} from '@angular/core';
import { MediaTypeResults, Item } from './../../models/search-result.model';
import { getBooks } from './../../+state/reducers/index';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromRoot from './../../+state/reducers';
import * as fromSearch from './../../+state/reducers/search.reducer';
import * as searchAction from './../../+state/actions/search.actions';
import * as sessionAction from './../../+state/actions/session.actions';
import * as itemAction from './../../+state/actions/item.actions';
import { Hint } from './../../core/typeahead-service/hints.model';
import { SuperSearchResult } from '../../models/search-result.model';

@Component({
  selector: 'app-search-box',
  template: `
    <app-search-box-container 
      [hints]="(search | async).hints"
      (searchSelected)="onSearchSelected()"
      (query)="query($event)"
      (hintSelected)="addFilter($event)"
      (debugChanged)="debugChanged($event)"
      >
    </app-search-box-container>
  `
})
export class SearchBoxPageComponent {
  @Output() searchSelected = new EventEmitter<void>();
  search: Observable<fromSearch.State> = this.store.select(
    fromRoot.getSearchState
  );

  constructor(private store: Store<fromRoot.State>) {}

  onSearchSelected(): void {
    this.store.dispatch(new searchAction.Search());
    this.searchSelected.emit();
  }

  query(query: string): void {
    this.store.dispatch(new searchAction.SetQuery(query));
    this.store.dispatch(new searchAction.LoadHints());
  }

  addFilter(filter: Hint): void {
    this.store.dispatch(new searchAction.AddFilter(filter));
  }

  debugChanged(debug: boolean): void {
    debug
      ? this.store.dispatch(new sessionAction.DebugOn())
      : this.store.dispatch(new sessionAction.DebugOff());
  }
}
