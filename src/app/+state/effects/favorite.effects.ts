import { AddToListSuccess } from './../actions/favorite.actions';
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { map, tap } from 'rxjs/operators';

import {
  AddList,
  AddToList,
  FavoriteActionTypes
} from '../actions/favorite.actions';
import { FavoriteService } from './../../core/favorite-service/favorite.service';
import * as fromRoot from './../reducers';

@Injectable()
export class FavoriteEffects {
  @Effect({ dispatch: false })
  addList: Observable<Action> = this.actions
    .ofType(FavoriteActionTypes.AddList)
    .pipe(
      map(action => action),
      tap((action: AddList) => this.favoriteService.addList(action.payload))
    );

  @Effect({ dispatch: false })
  addToList: Observable<Action> = this.actions
    .ofType(FavoriteActionTypes.AddToList)
    .pipe(
      map(action => action),
      tap((action: AddToList) => {
        this.favoriteService.addToList(action.payload);
      })
    );

  @Effect({ dispatch: false })
  addToListSuccess: Observable<Action> = this.actions
    .ofType(FavoriteActionTypes.AddToListSuccess)
    .pipe(map(action => action), tap((action: AddToList) => {}));

  constructor(
    private actions: Actions,
    private favoriteService: FavoriteService,
    private afs: AngularFirestore,
    private store: Store<fromRoot.State>
  ) {}
}
