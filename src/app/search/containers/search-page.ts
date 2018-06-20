import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { Genre } from '../../models/genre-options.model';
import { Sort } from '../../models/sort-options';
import * as searchAction from './../../+state/actions/search.actions';
import * as sessionAction from './../../+state/actions/session.actions';
import * as fromRoot from './../../+state/reducers';
import * as fromSearch from './../../+state/reducers/search.reducer';
import { Hint } from './../../core/typeahead-service/hints.model';
import { MediaTypeResults } from './../../models/search-result.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-search
      [search]="search | async"
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
      (genreChanged)="genreChanged($event)"
      (debugChanged)="debugChanged($event)"
      (loadMore)="loadMore()">
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
  private destroyed: Subject<void> = new Subject();

  constructor(private store: Store<fromRoot.State>) {}

  ngOnInit() {
    this.store.dispatch(new searchAction.SearchAggs());
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  toggleFilter(hint: Hint): void {
    this.store.dispatch(new searchAction.ToggleFilter(hint));
    this.store.dispatch(new searchAction.Search());
  }

  removeFilter(hint: Hint): void {
    this.store.dispatch(new searchAction.RemoveFilter(hint));
    this.store.dispatch(new searchAction.Search());
  }

  addFilter(hint: Hint): void {
    this.store.dispatch(new searchAction.AddFilter(hint));
    this.store.dispatch(new searchAction.Search());
  }

  searchSelected(query: string): void {
    this.store.dispatch(
      new searchAction.UpdateCriteria({
        q: query
      })
    );
    this.store.dispatch(new searchAction.Search());
  }

  mediaTypeChanged(mediaType: string): void {
    this.store.dispatch(
      new searchAction.UpdateCriteria({
        mediaType: mediaType
      })
    );
    this.store.dispatch(new searchAction.Search());
  }

  sortChanged(sort: Sort): void {
    this.store.dispatch(
      new searchAction.UpdateCriteria({
        sort: sort
      })
    );
    this.store.dispatch(new searchAction.Search());
  }

  genreChanged(genre: Genre): void {
    if (genre) {
      this.store.dispatch(
        new searchAction.UpdateCriteria({
          genre: genre,
          mediaType: genre.mediaType
        })
      );
    } else {
      this.store.dispatch(
        new searchAction.UpdateCriteria({
          genre: new Genre()
        })
      );
    }
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
}
