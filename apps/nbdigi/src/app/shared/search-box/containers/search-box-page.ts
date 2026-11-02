import {
  Component,
  Input,
  EventEmitter,
  NgZone,
  Output,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppFacade } from '../../../+state/app/app.facade';
import { SearchFacade } from '../../../+state/search/search.facade';
import { SearchState } from '../../../+state/search/search.reducer';
import { Criteria } from '../../../core/models';
import { Hint } from '../../../core/models/hints.model';
import { AiSearchStore } from '../../../ai-search/ai-search.store';

@Component({
  selector: 'nbd-search-box',
  template: `
    <nbd-search-box-container
      #searchInput
      [q]="q | async"
      [chatOnly]="chatOnly"
      [showAiSearchLink]="showAiSearchLink"
      [hints]="$safeNavigationMigration((search | async)?.hints)"
      [activeCriteria]="chatOnly ? chat.criteria() : (criteria | async)"
      [messages]="chat.messages()"
      [pending]="chat.pending()"
      [chatError]="chat.error()"
      [canUndo]="chat.canUndo()"
      [pendingLabel]="chat.pendingLabel()"
      (chatSubmitted)="chat.send($event, searchInput.defaultResultLimit())"
      (undoRequested)="chat.undo()"
      (filterRemoved)="chat.removeFilter($event)"
      (newestRequested)="chat.newestFirst()"
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
  @Input() chatOnly = false;
  @Input() showAiSearchLink = true;
  @Output() searchSelected = new EventEmitter<string>();
  search: Observable<SearchState> = this.searchFacade.state$;
  q: Observable<string> = this.searchFacade.getQ$;
  criteria = this.searchFacade.getCriteria$;
  readonly chat = inject(AiSearchStore);

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
    if (this.chatOnly) {
      this.chat.reset();
      return;
    }
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
