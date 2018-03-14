import { MediaTypeResults, Item } from './../../models/search-result.model';
import { getBooks } from './../../+state/reducers/index';
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
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
      [pristine]="pristine | async"
      [books]="books | async"
      [newspapers]="newspapers | async"
      [photos]="photos | async"
      [periodicals]="periodicals | async"
      [maps]="maps | async"
      [musicBooks]="musicBooks | async"
      [musicManuscripts]="musicManuscripts | async"
      [posters]="posters | async"
      [privateArchives]="privateArchives | async"
      [programReports]="programReports | async"
      [others]="others | async"
      [moreUrl]="moreUrl | async"
      (searchSelected)="searchSelected()"
      (query)="query($event)"
      (addFilter)="addFilter($event)"
      (removeFilter)="removeFilter($event)"
      (toggleFilter)="toggleFilter($event)"
      (mediaTypeChanged)="mediaTypeChanged($event)"
      (sortChanged)="sortChanged($event)"
      (loadMore)="loadMore()">
    </app-search>
  `
})
export class SearchPageComponent implements OnInit {
  search: Observable<fromSearch.State> = this.store.select(
    fromRoot.getSearchState
  );
  books: Observable<MediaTypeResults> = this.store.select(fromRoot.getBooks);
  newspapers: Observable<MediaTypeResults> = this.store.select(
    fromRoot.getNewspapers
  );
  photos: Observable<MediaTypeResults> = this.store.select(fromRoot.getPhotos);
  periodicals: Observable<MediaTypeResults> = this.store.select(
    fromRoot.getPeriodicals
  );
  maps: Observable<MediaTypeResults> = this.store.select(fromRoot.getMaps);
  musicBooks: Observable<MediaTypeResults> = this.store.select(
    fromRoot.getMusicBooks
  );
  musicManuscripts: Observable<MediaTypeResults> = this.store.select(
    fromRoot.getMusicManuscripts
  );
  posters: Observable<MediaTypeResults> = this.store.select(
    fromRoot.getPosters
  );
  privateArchives: Observable<MediaTypeResults> = this.store.select(
    fromRoot.getPrivateArchives
  );
  programReports: Observable<MediaTypeResults> = this.store.select(
    fromRoot.getProgramReports
  );
  others: Observable<MediaTypeResults> = this.store.select(fromRoot.getOthers);
  moreUrl: Observable<string> = this.store.select(fromRoot.getMoreUrl);
  pristine: Observable<boolean> = this.store.select(fromRoot.pristine);

  constructor(private store: Store<fromRoot.State>) {}

  ngOnInit() {
    this.store.dispatch(new searchAction.SearchAggs());
  }

  query(query: string): void {
    this.store.dispatch(new searchAction.SetQuery(query));
    this.store.dispatch(new searchAction.LoadHints());
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

  mediaTypeChanged(mediaType: string): void {
    this.store.dispatch(new searchAction.SetMediaType(mediaType));
  }

  sortChanged(sort: string): void {
    this.store.dispatch(new searchAction.SetSort(sort));
  }

  loadMore(): void {
    this.store.dispatch(new searchAction.LoadMore());
  }
}
