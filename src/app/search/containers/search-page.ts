import { User } from './../../models/user.model';
import { MediaTypeResults, Item } from './../../models/search-result.model';
import { getBooks } from './../../+state/reducers/index';
import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromRoot from './../../+state/reducers';
import * as fromSearch from './../../+state/reducers/search.reducer';
import * as searchAction from './../../+state/actions/search.actions';
import * as sessionAction from './../../+state/actions/session.actions';
import * as itemAction from './../../+state/actions/item.actions';
import { Hint } from './../../core/typeahead-service/hints.model';
import { SuperSearchResult } from '../../models/search-result.model';
import { AngularFirestore } from 'angularfire2/firestore';
import { filter } from 'rxjs/operators';
import { Criteria } from '../../models/criteria';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-search
      [search]="search | async"
      [criterias]="criterias | async"
      [currentMediaTypeCount]="currentMediaTypeCount | async"
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
      [isDebugOn]="isDebugOn | async"
      (searchSelected)="searchSelected($event)"
      (addFilter)="addFilter($event)"
      (removeFilter)="removeFilter($event)"
      (toggleFilter)="toggleFilter($event)"
      (mediaTypeChanged)="mediaTypeChanged($event)"
      (sortChanged)="sortChanged($event)"
      (debugChanged)="debugChanged($event)"
      (loadMore)="loadMore()"
      (changeCriteria)="changeCriteria($event)">
    </app-search>
  `
})
export class SearchPageComponent implements OnInit, OnDestroy {
  search: Observable<fromSearch.State> = this.store.select(
    fromRoot.getSearchState
  );
  currentMediaTypeCount: Observable<number> = this.store.select(
    fromRoot.getCurrentMediaTypeCount
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
  isDebugOn: Observable<boolean> = this.store.select(fromRoot.isDebugOn);
  criterias: Observable<Criteria[]>;

  constructor(
    private afs: AngularFirestore,
    private store: Store<fromRoot.State>
  ) {
    this.store
      .select(fromRoot.currentUser)
      .pipe(filter(user => user !== null))
      .subscribe((user: User) => {
        this.criterias = afs
          .collection('users')
          .doc(user.uid)
          .collection<Criteria>('searchs', ref =>
            ref.orderBy('timestamp', 'desc').limit(20)
          )
          .valueChanges()
          .map(c => {
            return c;
          });
      });
  }
  ngOnInit() {
    this.store.dispatch(new searchAction.SearchAggs());
  }

  ngOnDestroy() {}

  toggleFilter(filter: Hint): void {
    this.store.dispatch(new searchAction.ToggleFilter(filter));
    this.store.dispatch(new searchAction.Search());
  }

  removeFilter(filter: Hint): void {
    this.store.dispatch(new searchAction.RemoveFilter(filter));
    this.store.dispatch(new searchAction.Search());
  }

  addFilter(filter: Hint): void {
    this.store.dispatch(new searchAction.AddFilter(filter));
    this.store.dispatch(new searchAction.Search());
  }

  searchSelected(query: string): void {
    this.store.dispatch(new searchAction.Search());
  }

  mediaTypeChanged(mediaType: string): void {
    this.store.dispatch(new searchAction.SetMediaType(mediaType));
    this.store.dispatch(new searchAction.Search());
  }

  sortChanged(sort: string): void {
    this.store.dispatch(new searchAction.SetSort(sort));
    this.store.dispatch(new searchAction.Search());
  }

  debugChanged(debug: boolean): void {
    debug
      ? this.store.dispatch(new sessionAction.DebugOn())
      : this.store.dispatch(new sessionAction.DebugOff());
    this.store.dispatch(new searchAction.Search());
  }

  loadMore(): void {
    this.store.dispatch(new searchAction.LoadMore());
  }

  changeCriteria(criteria: Criteria): void {
    this.store.dispatch(new searchAction.ClearAll());
    this.store.dispatch(new searchAction.SetQuery(criteria.q));
    this.store.dispatch(new searchAction.SetMediaType(criteria.mediaType));
    this.store.dispatch(new searchAction.SetSort(criteria.sort));
    criteria.filters.forEach(f =>
      this.store.dispatch(new searchAction.AddFilter(f))
    );
    this.store.dispatch(new searchAction.Search());
  }
}
