import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromRoot from '../../../+state/reducers';
import { SearchFacade } from '../../../+state/search/search.facade';
import { SearchState } from '../../../+state/search/search.reducer';
import { SessionFacade } from '../../../+state/session/session.facade';
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
  search: Observable<SearchState> = this.searchFacade.state$;
  q: Observable<string> = this.searchFacade.getQ$;

  constructor(
    private router: Router,
    private searchFacade: SearchFacade,
    private sessionFacade: SessionFacade
  ) {}

  onSearchSelected(query: string): void {
    this.searchSelected.emit(query);
  }

  query(query: string): void {
    this.searchFacade.loadHints(query);
  }

  addFilter(filter: Hint): void {
    this.searchFacade.updateCriteria({
      q: null
    });
    this.searchFacade.addFilter(filter);
    this.searchFacade.search();
  }

  onClearAll(): void {
    this.searchFacade.clearAll();
    this.searchFacade.searchAggs();
    this.router.navigate(['/search']);
  }

  debugChanged(debug: boolean): void {
    debug
      ? this.sessionFacade.debugOn()
      : this.sessionFacade.debugOff();
  }
}
