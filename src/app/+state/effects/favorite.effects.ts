import { Injectable } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, exhaustMap, map, tap } from 'rxjs/operators';
import { RenameFavoriteDialogComponent } from '../../my-library/components/rename-favorite-dialog/rename-favorite-dialog.component';
import { AddToFavoriteListDialogComponent } from '../../my-library/containers/add-to-favorite-list-dialog/add-to-favorite-list-dialog.component';
import * as favoriteActions from '../actions/favorite.actions';
import {
  AddList,
  AddToList,
  FavoriteActionTypes,
  OpenDialog,
  OpenList,
  RemoveFromList,
  RenameList
} from '../actions/favorite.actions';
import { FavoriteService } from './../../core/favorite-service/favorite.service';

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

  @Effect({ dispatch: false })
  openList: Observable<Action> = this.actions.pipe(
    ofType(FavoriteActionTypes.OpenList),
    map(action => action),
    tap((action: OpenList) => {
      this.router.navigate(['/mylibrary', action.payload]);
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
  renameList: Observable<Action> = this.actions.pipe(
    ofType(FavoriteActionTypes.RenameList),
    map(action => action),
    exhaustMap((action: RenameList) =>
      this.dialog
        .open(RenameFavoriteDialogComponent, { data: action.payload })
        .afterClosed()
        .pipe(
          map(result => {
            console.log(result);
            if (result) {
              this.favoriteService.renameList(action.payload, result.newName);
              return new favoriteActions.RenameListSuccess();
            } else {
              return new favoriteActions.RenameListCancelled();
            }
          }),
          catchError(error => of(new favoriteActions.Error()))
        )
    )
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

  @Effect()
  removeFromList: Observable<Action> = this.actions.pipe(
    ofType(FavoriteActionTypes.RemoveFromList),
    map(action => action),
    map((action: RemoveFromList) => {
      this.favoriteService.removeFromList(action.payload);
      return new favoriteActions.RemoveFromListSuccess();
    }),
    catchError(err => of(new favoriteActions.Error()))
  );

  @Effect({ dispatch: false })
  removeFromSuccess: Observable<Action> = this.actions.pipe(
    ofType(FavoriteActionTypes.RemoveFromListSuccess),
    map(action => action),
    tap(() => {
      this.snackBar.open('Fjernet fra din liste', null, {
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
    private router: Router,
    private actions: Actions,
    private favoriteService: FavoriteService
  ) {}
}
