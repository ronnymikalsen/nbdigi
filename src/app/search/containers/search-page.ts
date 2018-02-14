import { MediaTypeResults, Item } from './../../models/search-result.model';
import { getBooks } from './../../+state/reducers/index';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromRoot from './../../+state/reducers';
import * as fromSearch from './../../+state/reducers/search.reducer';
import * as searchAction from './../../+state/actions/search.actions';
import * as itemAction from './../../+state/actions/item.actions';
import { Hint } from './../../core/typeahead-service/hints.model';
import { SuperSearchResult } from '../../models/search-result.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-search
      [search]="search | async"
      [books]="books | async"
      [newspapers]="newspapers | async"
      [photos]="photos | async"
      [periodicals]="periodicals | async"
      [others]="others | async"
      (searchSelected)="searchSelected()"
      (query)="query($event)"
      (addFilter)="addFilter($event)"
      (removeFilter)="removeFilter($event)"
      (toggleFilter)="toggleFilter($event)"
      (itemSelected)="open($event)"
      (mediatypeSelected)="showMore($event)">
    </app-search>
  `
})
export class SearchPageComponent {
  search: Observable<fromSearch.State> = this.store.select(fromRoot.getSearchState);
  books: Observable<MediaTypeResults> = this.store.select(fromRoot.getBooks);
  newspapers: Observable<MediaTypeResults> = this.store.select(fromRoot.getNewspapers);
  photos: Observable<MediaTypeResults> = this.store.select(fromRoot.getPhotos);
  periodicals: Observable<MediaTypeResults> = this.store.select(fromRoot.getPeriodicals);
  others: Observable<MediaTypeResults> = this.store.select(fromRoot.getOthers);

  constructor(private store: Store<fromRoot.State>) { }

  query(query: string): void {
    this.store.dispatch(new searchAction.LoadHints(query));
    this.store.dispatch(new searchAction.SetQuery(query));
  }

  toggleFilter(filter: Hint): void {
    this.store.dispatch(new searchAction.ToggleFilter(filter));
  }

  removeFilter(filter: Hint): void {
    this.store.dispatch(new searchAction.RemoveFilter(filter));
  }

  addFilter(filter: Hint): void {
    this.store.dispatch(new searchAction.AddFilter(filter));
  }

  searchSelected(): void {
    this.store.dispatch(new searchAction.Search());
  }

  showMore(mediaTypeResults: MediaTypeResults): void {
    this.store.dispatch(new searchAction.SetMediaType(mediaTypeResults.mediaType));
  }

  open(item: Item): void {
    this.store.dispatch(new itemAction.Open(item));
  }

}
