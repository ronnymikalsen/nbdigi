import { Injectable } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { AngularFirestore } from 'angularfire2/firestore';
import { of, Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { AddToFavoriteListDialogComponent } from '../../my-library/containers/add-to-favorite-list-dialog/add-to-favorite-list-dialog.component';
import * as favoriteActions from '../actions/favorite.actions';
import {
  AddList,
  AddToList,
  FavoriteActionTypes,
  OpenDialog
} from '../actions/favorite.actions';
import { FavoriteService } from './../../core/favorite-service/favorite.service';
import * as fromRoot from './../reducers';

@Injectable()
export class FavoriteEffects {
  @Effect({ dispatch: false })
  open: Observable<Action> = this.actions.pipe(
    ofType(FavoriteActionTypes.OpenDialog),
    map(action => action),
    tap((action: OpenDialog) => {
      const dialogRef = this.dialog.open(AddToFavoriteListDialogComponent, {
        data: {
          item: action.payload
        }
      });
    })
  );

  @Effect()
  addList: Observable<Action> = this.actions.pipe(
    ofType(FavoriteActionTypes.AddList),
    map(action => action),
    map((action: AddList) => {
      this.favoriteService.addList(action.payload);
      return new favoriteActions.AddListSuccess();
    }),
    catchError(err => of(new favoriteActions.Error()))
  );

  @Effect({ dispatch: false })
  addListSuccess: Observable<Action> = this.actions.pipe(
    ofType(FavoriteActionTypes.AddList),
    tap(() => {
      this.snackBar.open('Ny liste er lagret', null, {
        duration: 2000
      });
    })
  );

  @Effect()
  addToList: Observable<Action> = this.actions.pipe(
    ofType(FavoriteActionTypes.AddToList),
    map(action => action),
    map((action: AddToList) => {
      this.favoriteService.addToList(action.payload);
      return new favoriteActions.AddToListSuccess();
    }),
    catchError(err => of(new favoriteActions.Error()))
  );

  @Effect({ dispatch: false })
  addToListSuccess: Observable<Action> = this.actions.pipe(
    ofType(FavoriteActionTypes.AddToListSuccess),
    map(action => action),
    tap(() => {
      this.snackBar.open('Lagt til i din liste', null, {
        duration: 2000
      });
    })
  );

  @Effect({ dispatch: false })
  error: Observable<Action> = this.actions.pipe(
    ofType(FavoriteActionTypes.Error),
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
