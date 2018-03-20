import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from 'angularfire2/firestore';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { filter } from 'rxjs/operators';

import * as fromRoot from './../../+state/reducers';
import * as itemAction from './../../+state/actions/item.actions';
import * as searchAction from './../../+state/actions/search.actions';
import * as homeAction from './../../+state/actions/home.actions';
import { Item, MediaTypeResults } from './../../models/search-result.model';
import { User } from './../../models/user.model';
import { Router } from '@angular/router';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<app-home 
      [items]="items | async"
      [newBooks]="newBooks | async"
      [newPeriodicals]="newPeriodicals | async"
      [newPhotos]="newPhotos | async"
      [isDebugOn]="isDebugOn | async"
      (showMoreBooks)="onShowMoreBooks()"
      (showMorePeriodicals)="onShowMorePeriodicals()"
      (showMorePhotos)="onShowMorePhotos()"
      (searchSelected)="onSearchSelected()"
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
          .map(i => {
            return new MediaTypeResults({
              items: i
            });
          });
      });
  }

  ngOnInit() {
    this.store.dispatch(new homeAction.LoadNewBooks());
    this.store.dispatch(new homeAction.LoadNewPeriodicals());
    this.store.dispatch(new homeAction.LoadNewPhotos());
  }

  onShowMoreBooks() {
    this.store.dispatch(new searchAction.SetMediaType('bøker'));
    this.store.dispatch(
      new searchAction.SetSort('firstDigitalContentTime,desc')
    );
  }
  onShowMorePeriodicals() {
    this.store.dispatch(new searchAction.SetMediaType('tidsskrift'));
    this.store.dispatch(
      new searchAction.SetSort('firstDigitalContentTime,desc')
    );
  }
  onShowMorePhotos() {
    this.store.dispatch(new searchAction.SetMediaType('bilder'));
    this.store.dispatch(
      new searchAction.SetSort('firstDigitalContentTime,desc')
    );
  }

  onSearchSelected() {}
}
