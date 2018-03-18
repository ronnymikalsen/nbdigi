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
import { Item, MediaTypeResults } from './../../models/search-result.model';
import { User } from './../../models/user.model';
import { Router } from '@angular/router';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<app-home 
      [items]="items | async"
      [isDebugOn]="isDebugOn | async"
      (searchSelected)="onSearchSelected()">
    </app-home>`
})
export class HomePageComponent implements OnInit {
  items: Observable<MediaTypeResults>;
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

  ngOnInit() {}

  onSearchSelected() {}
}
