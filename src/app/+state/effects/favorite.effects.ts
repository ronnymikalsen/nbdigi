import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from 'angularfire2/firestore';
import { Actions, Effect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { tap, map, switchMap, filter, take } from 'rxjs/operators';
import * as firebase from 'firebase/app';

import * as fromRoot from './../reducers';
import * as favoriteAction from '../actions/favorite.actions';
import { Item } from '../../models/search-result.model';
import { FavoriteActionTypes, AddList } from '../actions/favorite.actions';
import { ViewerService } from '../../core/viewer-service/viewer.service';
import { User } from './../../models/user.model';
import { FavoriteList } from './../../models/favorite-list';

@Injectable()
export class FavoriteEffects {
  private favoritesRef: AngularFirestoreCollection<FavoriteList>;

  @Effect()
  fetchLists: Observable<Action> = this.actions
    .ofType(FavoriteActionTypes.FetchLists)
    .pipe(
      switchMap(() =>
        this.favoritesRef
          .valueChanges()
          .pipe(
            take(1),
            map(
              (lists: FavoriteList[]) =>
                new favoriteAction.FetchListsSuccess(lists)
            )
          )
      )
    );

  @Effect({ dispatch: false })
  addList: Observable<Action> = this.actions
    .ofType(FavoriteActionTypes.AddList)
    .pipe(
      map(action => action),
      tap((action: AddList) =>
        this.favoritesRef.doc(action.payload).set({
          name: action.payload,
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
        this.favoritesRef = afs
          .collection('users')
          .doc(user.uid)
          .collection('favorites');
      });
  }
}
