import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Item, MediaTypeResults, SortOptions, User } from '@nbdigi/data-models';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { HomeFacade } from '@nbdigi/home-state';

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
  newBooks: Observable<MediaTypeResults> = this.facade.getNewBooks$;
  newPeriodicals: Observable<MediaTypeResults> = this.facade.getNewPeriodicals$;
  newPhotos: Observable<MediaTypeResults> = this.facade.getNewPhotos$;
  newNewspapers: Observable<MediaTypeResults> = this.facade.getNewNewspapers$;
  newOthers: Observable<MediaTypeResults> = this.facade.getNewOthers$;

  isDebugOn: Observable<boolean> = this.store.select(fromRoot.isDebugOn);
  showItemDetails: Observable<boolean> = this.store.select(
    fromRoot.showItemDetails
  );

  constructor(
    private router: Router,
    private afs: AngularFirestore,
    private facade: HomeFacade,
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
    this.store.dispatch(new homeAction.LoadNewItems());
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
    this.store.dispatch(
      new searchAction.SetCriteria({
        q: q
      })
    );
    this.store.dispatch(new searchAction.Search());
  }

  private showNewArrivals(mediaType: string) {
    this.store.dispatch(
      new searchAction.SetCriteria({
        mediaType: mediaType,
        sort: new SortOptions().newArrivals
      })
    );
    this.store.dispatch(new searchAction.Search());
  }
}