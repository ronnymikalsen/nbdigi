import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ItemActions } from '../../+state/actions';
import { HomeFacade } from '../../+state/home/home.facade';
import * as fromRoot from '../../+state/reducers';
import { SearchFacade } from '../../+state/search/search.facade';
import { Item, MediaTypeResults, SortOptions, User } from '../../core/models';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nbd-home
      [items]="items | async"
      [newBooks]="newBooks | async"
      [newPeriodicals]="newPeriodicals | async"
      [newPhotos]="newPhotos | async"
      [newNewspapers]="newNewspapers | async"
      [newOthers]="newOthers | async"
      [showItemDetails]="showItemDetails | async"
      [isDebugOn]="isDebugOn | async"
      (showMoreBooks)="onShowMoreBooks()"
      (showMorePeriodicals)="onShowMorePeriodicals()"
      (showMorePhotos)="onShowMorePhotos()"
      (showMoreNewspapers)="onShowMoreNewspapers()"
      (searchSelected)="onSearchSelected($event)"
    >
    </nbd-home>
  `
})
export class HomePageComponent implements OnInit, OnDestroy {
  items: Observable<MediaTypeResults>;
  newBooks: Observable<MediaTypeResults> = this.homeFacade.getNewBooks$;
  newPeriodicals: Observable<MediaTypeResults> = this.homeFacade
    .getNewPeriodicals$;
  newPhotos: Observable<MediaTypeResults> = this.homeFacade.getNewPhotos$;
  newNewspapers: Observable<MediaTypeResults> = this.homeFacade
    .getNewNewspapers$;
  newOthers: Observable<MediaTypeResults> = this.homeFacade.getNewOthers$;
  isDebugOn: Observable<boolean> = this.store.select(fromRoot.isDebugOn);
  showItemDetails: Observable<boolean> = this.store.select(
    fromRoot.showItemDetails
  );

  constructor(
    private homeFacade: HomeFacade,
    private searchFacade: SearchFacade,
    private router: Router,
    private afs: AngularFirestore,
    private store: Store<fromRoot.State>
  ) {
    this.store
      .select(fromRoot.currentUser)
      .pipe(filter(user => user !== null))
      .subscribe((user: User) => {
        this.items = afs
          .collection('users')
          .doc(user.uid)
          .collection<Item>('items', ref =>
            ref.orderBy('timestamp', 'desc').limit(20)
          )
          .valueChanges()
          .pipe(
            map(i => {
              return new MediaTypeResults({
                items: i
              });
            })
          );
      });
  }

  ngOnInit() {
    this.homeFacade.loadNewItems();
  }

  ngOnDestroy() {
    this.store.dispatch(new ItemActions.CloseItemDetails());
  }

  onShowMoreBooks() {
    this.showNewArrivals('bøker');
  }

  onShowMorePeriodicals() {
    this.showNewArrivals('tidsskrift');
  }

  onShowMorePhotos() {
    this.showNewArrivals('bilder');
  }

  onShowMoreNewspapers() {
    this.showNewArrivals('aviser');
  }

  onSearchSelected(q: string) {
    this.searchFacade.setCriteria({
      q: q
    });
    this.searchFacade.search();
  }

  private showNewArrivals(mediaType: string) {
    this.searchFacade.setCriteria({
      mediaType: mediaType,
      sort: new SortOptions().newArrivals
    });
    this.searchFacade.search();
  }
}
