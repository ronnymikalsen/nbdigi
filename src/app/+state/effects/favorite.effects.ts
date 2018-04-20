import { AddToListSuccess } from './../actions/favorite.actions';
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { map, tap, catchError } from 'rxjs/operators';

import {
  AddList,
  AddToList,
  FavoriteActionTypes
} from '../actions/favorite.actions';
import { FavoriteService } from './../../core/favorite-service/favorite.service';
import * as fromRoot from './../reducers';
import * as favoriteActions from '../actions/favorite.actions';
import { MatSnackBar, MatDialog } from '@angular/material';
import { Item } from '../../models/search-result.model';
import { AddToFavoriteListDialogComponent } from '../../my-library/containers/add-to-favorite-list-dialog/add-to-favorite-list-dialog.component';

@Injectable()
export class FavoriteEffects {
  @Effect({ dispatch: false })
  open: Observable<Action> = this.actions
    .ofType(FavoriteActionTypes.OpenDialog)
    .pipe(
      map(action => action),
      tap(item => {
        const dialogRef = this.dialog.open(AddToFavoriteListDialogComponent, {
          data: {
            item: item
          }
        });
      })
    );

  @Effect()
  addList: Observable<Action> = this.actions
    .ofType(FavoriteActionTypes.AddList)
    .pipe(
      map(action => action),
      map((action: AddList) => {
        this.favoriteService.addList(action.payload);
        return new favoriteActions.AddListSuccess();
      }),
      catchError(err => Observable.of(new favoriteActions.Error()))
    );

  @Effect({ dispatch: false })
  addListSuccess: Observable<Action> = this.actions
    .ofType(FavoriteActionTypes.AddList)
    .pipe(
      tap(() => {
        this.snackBar.open('Ny liste er lagret', null, {
          duration: 2000
        });
      })
    );

  @Effect()
  addToList: Observable<Action> = this.actions
    .ofType(FavoriteActionTypes.AddToList)
    .pipe(
      map(action => action),
      map((action: AddToList) => {
        this.favoriteService.addToList(action.payload);
        return new favoriteActions.AddToListSuccess();
      }),
      catchError(err => Observable.of(new favoriteActions.Error()))
    );

  @Effect({ dispatch: false })
  addToListSuccess: Observable<Action> = this.actions
    .ofType(FavoriteActionTypes.AddToListSuccess)
    .pipe(
      map(action => action),
      tap(() => {
        this.snackBar.open('Lagt til i din liste', null, {
          duration: 2000
        });
      })
    );

  @Effect({ dispatch: false })
  error: Observable<Action> = this.actions
    .ofType(FavoriteActionTypes.Error)
    .pipe(
      tap(() => {
        this.snackBar.open('Det har oppstått en feil', null, {
          duration: 2000,
          panelClass: 'error'
        });
      })
    );

  constructor(
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    private actions: Actions,
    private favoriteService: FavoriteService,
    private afs: AngularFirestore,
    private store: Store<fromRoot.State>
  ) {}
}
