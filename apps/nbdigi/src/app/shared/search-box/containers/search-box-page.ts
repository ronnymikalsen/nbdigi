import {
  Component,
  EventEmitter,
  NgZone,
  Output,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppFacade } from '../../../+state/app/app.facade';
import { SearchFacade } from '../../../+state/search/search.facade';
import { SearchState } from '../../../+state/search/search.reducer';
import { Criteria } from '../../../core/models';
import { Hint } from '../../../core/models/hints.model';

@Component({
  selector: 'nbd-search-box',
  template: `
    <nbd-search-box-container
      [q]="q | async"
      [hints]="$safeNavigationMigration((search | async)?.hints)"
      (searchSelected)="onSearchSelected($event)"
      (query)="query($event)"
      (hintSelected)="addFilter($event)"
      (clearAll)="onClearAll()"
      (debugChanged)="debugChanged($event)"
    >
    </nbd-search-box-container>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class SearchBoxPageComponent {
  @Output() searchSelected = new EventEmitter<string>();
  search: Observable<SearchState> = this.searchFacade.state$;
  q: Observable<string> = this.searchFacade.getQ$;

  constructor(
    private ngZone: NgZone,
    private router: Router,
    private searchFacade: SearchFacade,
    private appFacade: AppFacade,
  ) {}

  onSearchSelected(query: string): void {
    this.searchSelected.emit(query);
  }

  query(query: string): void {
    this.searchFacade.loadHints(query);
  }

  addFilter(filter: Hint): void {
    this.searchFacade.updateCriteria(
      new Criteria({
        q: '',
      }),
    );
    this.searchFacade.addFilter(filter);
    this.searchFacade.search();
  }

  onClearAll(): void {
    this.searchFacade.clearAll();
    this.searchFacade.searchAggs();
    this.ngZone.run(() => this.router.navigate(['/search']));
  }

  debugChanged(debug: boolean): void {
    if (debug) {
      this.appFacade.debugOn();
    } else {
      this.appFacade.debugOff();
    }
  }
}
