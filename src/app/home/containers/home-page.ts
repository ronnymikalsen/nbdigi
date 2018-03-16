import { Component, ChangeDetectionStrategy } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from 'angularfire2/firestore';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { filter } from 'rxjs/operators';

import * as fromRoot from './../../+state/reducers';
import * as itemAction from './../../+state/actions/item.actions';
import { Item } from './../../models/search-result.model';
import { User } from './../../models/user.model';
import { Router } from '@angular/router';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<app-home [items]="items | async" (searchSelected)="onSearchSelected()"></app-home>`
})
export class HomePageComponent {
  items: Observable<Item[]>;

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
            ref.orderBy('timestamp', 'desc').limit(1)
          )
          .valueChanges();
      });
  }

  onSearchSelected() {}
}
