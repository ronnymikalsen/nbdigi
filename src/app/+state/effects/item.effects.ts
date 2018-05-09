import { User } from './../../models/user.model';
import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from 'angularfire2/firestore';
import { Actions, Effect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { tap, map, switchMap, filter } from 'rxjs/operators';
import * as firebase from 'firebase/app';

import * as fromRoot from './../reducers';
import { Item } from '../../models/search-result.model';
import { ItemActionTypes, Open, Change } from '../actions/item.actions';
import { ViewerService } from '../../core/viewer-service/viewer.service';

@Injectable()
export class ItemEffects {
  private itemsRef: AngularFirestoreCollection<Item>;

  @Effect({ dispatch: false })
  open: Observable<Action> = this.actions
    .ofType(ItemActionTypes.Open)
    .pipe(
      map(action => action),
      tap((action: Open) => this.viewerService.open(action.payload))
    );

  @Effect({ dispatch: false })
  change: Observable<Action> = this.actions.ofType(ItemActionTypes.Change).pipe(
    map(action => action),
    tap((action: Change) =>
      this.itemsRef.doc(action.payload.id).set({
        ...action.payload,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      })
    )
  );

  constructor(
    private actions: Actions,
    private viewerService: ViewerService,
    private afs: AngularFirestore,
    private store: Store<fromRoot.State>
  ) {
    this.store
      .select(fromRoot.currentUser)
      .pipe(filter(user => user !== null))
      .subscribe((user: User) => {
        this.itemsRef = afs
          .collection('users')
          .doc(user.uid)
          .collection('items');
      });
  }
}
