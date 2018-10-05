import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import * as fromRoot from '../../+state/reducers';
import * as itemAction from '../../+state/actions/item.actions';
import * as searchAction from '../../+state/actions/search.actions';
import * as homeAction from '../../+state/actions/home.actions';
import { Item, MediaTypeResults } from '../../models/search-result.model';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';
import { SortOptions } from '../../models/sort-options';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<app-home 
      [items]="items | async"
      [newBooks]="newBooks | async"
      [newPeriodicals]="newPeriodicals | async"
      [newPhotos]="newPhotos | async"
      [newNewspapers]="newNewspapers | async"
      [newOthers]="newOthers | async"
      [isDebugOn]="isDebugOn | async"
      (showMoreBooks)="onShowMoreBooks()"
      (showMorePeriodicals)="onShowMorePeriodicals()"
      (showMorePhotos)="onShowMorePhotos()"
      (showMoreNewspapers)="onShowMoreNewspapers()"
      (searchSelected)="onSearchSelected($event)"
      >
    </app-home>`
})
export class HomePageComponent implements OnInit {
  items: Observable<MediaTypeResults>;
  newBooks: Observable<MediaTypeResults> = this.store.select(
    fromRoot.getNewBooks
  );
  newPeriodicals: Observable<MediaTypeResults> = this.store.select(
    fromRoot.getNewPeriodicals
  );
  newPhotos: Observable<MediaTypeResults> = this.store.select(
    fromRoot.getNewPhotos
  );
  newNewspapers: Observable<MediaTypeResults> = this.store.select(
    fromRoot.getNewNewspapers
  );
  newOthers: Observable<MediaTypeResults> = this.store.select(
    fromRoot.getNewOthers
  );
  isDebugOn: Observable<boolean> = this.store.select(fromRoot.isDebugOn);

  constructor(
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
    this.store.dispatch(new homeAction.LoadNewItems());
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
