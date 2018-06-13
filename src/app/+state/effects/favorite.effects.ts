import { Injectable } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of, EMPTY } from 'rxjs';
import {
  catchError,
  exhaustMap,
  map,
  tap,
  switchMap,
  take
} from 'rxjs/operators';
import { RemoveFavoriteDialogComponent } from '../../my-library/components/remove-favorite-dialog/remove-favorite-dialog.component';
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
  RemoveList,
  RenameList
} from '../actions/favorite.actions';
import { FavoriteService } from './../../core/favorite-service/favorite.service';

@Injectable()
export class FavoriteEffects {
  @Effect()
  addToList: Observable<Action> = this.actions.pipe(
    ofType(FavoriteActionTypes.OpenDialog),
    map(action => action),
    exhaustMap((action: OpenDialog) =>
      this.dialog
        .open(AddToFavoriteListDialogComponent, {
          data: {
            item: action.payload
          }
        })
        .afterClosed()
        .pipe(
          take(1),
          exhaustMap(result => {
            if (result) {
              return this.favoriteService.addToList(result).pipe(
                take(1),
                map(() => {
                  return new favoriteActions.AddToListSuccess();
                })
              );
            } else {
              return of(new favoriteActions.AddToListCancelled());
            }
          })
        )
    ),
    catchError(err => of(new favoriteActions.Error(err)))
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
    switchMap((action: AddList) =>
      this.favoriteService
        .addList(action.payload)
        .pipe(map(() => new favoriteActions.AddListSuccess()))
    ),
    catchError(err => of(new favoriteActions.Error(err)))
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
          exhaustMap(result => {
            if (result) {
              return this.favoriteService
                .renameList(action.payload, result.newName)
                .pipe(
                  take(1),
                  map(() => new favoriteActions.RenameListSuccess())
                );
            } else {
              return of(new favoriteActions.RenameListCancelled());
            }
          }),
          catchError(err => of(new favoriteActions.Error(err)))
        )
    )
  );

  @Effect({ dispatch: false })
  renameListSuccess: Observable<Action> = this.actions.pipe(
    ofType(FavoriteActionTypes.RenameListSuccess),
    map(action => action),
    tap(() => {
      this.snackBar.open('Listen har fått nytt navn', null, {
        duration: 2000
      });
    })
  );

  @Effect()
  removeList: Observable<Action> = this.actions.pipe(
    ofType(FavoriteActionTypes.RemoveList),
    map(action => action),
    exhaustMap((action: RemoveList) =>
      this.dialog
        .open(RemoveFavoriteDialogComponent, { data: action.payload })
        .afterClosed()
        .pipe(
          exhaustMap(result => {
            if (result) {
              return this.favoriteService.removeList(action.payload).pipe(
                take(1),
                map(() => {
                  return new favoriteActions.RemoveListSuccess(action.payload);
                })
              );
            } else {
              return of(new favoriteActions.RemoveListCancelled());
            }
          }),
          catchError(err => of(new favoriteActions.Error(err)))
        )
    )
  );

  @Effect({ dispatch: false })
  removeListSuccess: Observable<Action> = this.actions.pipe(
    ofType(FavoriteActionTypes.RemoveListSuccess),
    map(action => action),
    tap(() => {
      this.snackBar.open('Liste slettet', null, {
        duration: 2000
      });
    })
  );

  @Effect()
  removeFromList: Observable<Action> = this.actions.pipe(
    ofType(FavoriteActionTypes.RemoveFromList),
    map(action => action),
    switchMap((action: RemoveFromList) =>
      this.favoriteService
        .removeFromList(action.payload)
        .pipe(map(() => new favoriteActions.RemoveFromListSuccess()))
    ),
    catchError(err => of(new favoriteActions.Error(err)))
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
    map(action => action),
    tap(err => {
      console.error(err);
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
