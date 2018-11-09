import { Injectable } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { FavoriteList } from '@nbdigi/data-models';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, exhaustMap, map, take, tap } from 'rxjs/operators';
import { FavoriteService } from '../../core/favorite-service/favorite.service';
import { RemoveWarningDialogComponent } from '../../my-library/components/remove-warning-dialog/remove-warning-dialog.component';
import { AddToFavoriteListDialogComponent } from '../../my-library/containers/add-to-favorite-list-dialog/add-to-favorite-list-dialog.component';
import { RemoveFavoriteDialogComponent } from '../../my-library/shared/favorite-list-menu/favorite-list-menu-button/remove-favorite-dialog/remove-favorite-dialog.component';
import { RenameFavoriteDialogComponent } from '../../my-library/shared/favorite-list-menu/favorite-list-menu-button/rename-favorite-dialog/rename-favorite-dialog.component';
import { FavoriteActions } from '../actions';

@Injectable()
export class FavoriteEffects {
  @Effect()
  openAddToListDialog: Observable<Action> = this.actions.pipe(
    ofType(FavoriteActions.FavoriteActionTypes.OpenAddToListDialog),
    map(action => action),
    exhaustMap((action: FavoriteActions.OpenAddToListDialog) =>
      this.dialog
        .open(AddToFavoriteListDialogComponent, {
          data: {
            item: action.payload
          }
        })
        .afterClosed()
        .pipe(
          take(1),
          map(result => {
            if (result) {
              return new FavoriteActions.AddToList(result);
            } else {
              return new FavoriteActions.AddToListCancelled();
            }
          })
        )
    ),
    catchError(err => of(new FavoriteActions.Error(err)))
  );

  @Effect()
  addToList: Observable<Action> = this.actions.pipe(
    ofType<FavoriteActions.AddToList>(
      FavoriteActions.FavoriteActionTypes.AddToList
    ),
    map(action => action.payload),
    exhaustMap((favoriteList: FavoriteList) =>
      this.favoriteService.addToList(favoriteList).pipe(
        take(1),
        map(() => {
          return new FavoriteActions.AddToListSuccess();
        })
      )
    ),
    catchError(err => of(new FavoriteActions.Error(err)))
  );

  @Effect({ dispatch: false })
  addToListSuccess: Observable<Action> = this.actions.pipe(
    ofType(FavoriteActions.FavoriteActionTypes.AddToListSuccess),
    tap(() => {
      this.snackBar.open('Lagt til i din liste', null, {
        duration: 2000
      });
    })
  );

  @Effect({ dispatch: false })
  openList: Observable<Action> = this.actions.pipe(
    ofType<FavoriteActions.OpenList>(
      FavoriteActions.FavoriteActionTypes.OpenList
    ),
    tap((action: FavoriteActions.OpenList) =>
      this.router.navigate(['/mylibrary', action.payload])
    )
  );

  @Effect()
  addList: Observable<Action> = this.actions.pipe(
    ofType<FavoriteActions.AddList>(
      FavoriteActions.FavoriteActionTypes.AddList
    ),
    map(action => action.payload),
    exhaustMap((listName: string) =>
      this.favoriteService
        .addList(listName)
        .pipe(map(() => new FavoriteActions.AddListSuccess()))
    ),
    catchError(err => of(new FavoriteActions.Error(err)))
  );

  @Effect({ dispatch: false })
  addListSuccess: Observable<Action> = this.actions.pipe(
    ofType<FavoriteActions.AddList>(
      FavoriteActions.FavoriteActionTypes.AddList
    ),
    tap(() => {
      this.snackBar.open('Ny liste er lagret', null, {
        duration: 2000
      });
    })
  );

  @Effect()
  openRenameListDialog: Observable<Action> = this.actions.pipe(
    ofType<FavoriteActions.OpenRenameListDialog>(
      FavoriteActions.FavoriteActionTypes.OpenRenameListDialog
    ),
    map(action => action.payload),
    exhaustMap((favoriteList: FavoriteList) =>
      this.dialog
        .open(RenameFavoriteDialogComponent, {
          data: favoriteList
        })
        .afterClosed()
        .pipe(
          take(1),
          map(result => {
            if (result) {
              return new FavoriteActions.RenameList(result);
            } else {
              return new FavoriteActions.AddToListCancelled();
            }
          })
        )
    ),
    catchError(err => of(new FavoriteActions.Error(err)))
  );

  @Effect()
  renameList: Observable<Action> = this.actions.pipe(
    ofType<FavoriteActions.RenameList>(
      FavoriteActions.FavoriteActionTypes.RenameList
    ),
    map(action => action.payload),
    exhaustMap((result: any) =>
      this.favoriteService.renameList(result.favoriteList, result.newName).pipe(
        take(1),
        map(() => new FavoriteActions.RenameListSuccess())
      )
    )
  );

  @Effect({ dispatch: false })
  renameListSuccess: Observable<Action> = this.actions.pipe(
    ofType<FavoriteActions.RemoveListSuccess>(
      FavoriteActions.FavoriteActionTypes.RenameListSuccess
    ),
    tap(() => {
      this.snackBar.open('Listen har fått nytt navn', null, {
        duration: 2000
      });
    })
  );

  @Effect()
  removeList: Observable<Action> = this.actions.pipe(
    ofType<FavoriteActions.RemoveList>(
      FavoriteActions.FavoriteActionTypes.RemoveList
    ),
    map(action => action),
    exhaustMap((action: FavoriteActions.RemoveList) =>
      this.dialog
        .open(RemoveFavoriteDialogComponent, { data: action.payload })
        .afterClosed()
        .pipe(
          map(result => {
            if (result) {
              return new FavoriteActions.RemoveListConfirmed(action.payload);
            } else {
              return new FavoriteActions.RemoveListCancelled();
            }
          })
        )
    )
  );

  @Effect()
  removeListConfirmed: Observable<Action> = this.actions.pipe(
    ofType<FavoriteActions.RemoveListConfirmed>(
      FavoriteActions.FavoriteActionTypes.RemoveListConfirmed
    ),
    map(action => action.payload),
    exhaustMap((favoriteList: FavoriteList) => {
      let action;
      if (favoriteList) {
        action = this.favoriteService.removeList(favoriteList).pipe(
          take(1),
          map(() => new FavoriteActions.RemoveListSuccess(favoriteList)),
          catchError(err => of(new FavoriteActions.Error(err)))
        );
      } else {
        action = of(new FavoriteActions.RemoveListCancelled());
      }
      return action;
    })
  );

  @Effect({ dispatch: false })
  removeListSuccess: Observable<Action> = this.actions.pipe(
    ofType<FavoriteActions.RemoveListSuccess>(
      FavoriteActions.FavoriteActionTypes.RemoveListSuccess
    ),
    tap(() => {
      this.snackBar.open('Listen er slettet', null, {
        duration: 2000
      });
      this.router.navigate(['/mylibrary']);
    })
  );

  @Effect()
  removeFromList: Observable<Action> = this.actions.pipe(
    ofType<FavoriteActions.RemoveFromList>(
      FavoriteActions.FavoriteActionTypes.RemoveFromList
    ),
    map(action => action.payload),
    exhaustMap((favoriteList: FavoriteList) =>
      this.dialog
        .open(RemoveWarningDialogComponent, { data: favoriteList.items[0] })
        .afterClosed()
        .pipe(
          map(result => {
            if (result) {
              return new FavoriteActions.RemoveFromListConfirmed(favoriteList);
            } else {
              return new FavoriteActions.RemoveFromListCancelled();
            }
          })
        )
    ),
    catchError(err => of(new FavoriteActions.Error(err)))
  );

  @Effect()
  removeFromListConfirmed: Observable<Action> = this.actions.pipe(
    ofType<FavoriteActions.RemoveFromListConfirmed>(
      FavoriteActions.FavoriteActionTypes.RemoveFromListConfirmed
    ),
    map(action => action.payload),
    exhaustMap((favoriteList: FavoriteList) =>
      this.favoriteService
        .removeFromList(favoriteList)
        .pipe(map(() => new FavoriteActions.RemoveFromListSuccess()))
    ),
    catchError(err => of(new FavoriteActions.Error(err)))
  );

  @Effect({ dispatch: false })
  removeFromListSuccess: Observable<Action> = this.actions.pipe(
    ofType<FavoriteActions.RemoveFromListSuccess>(
      FavoriteActions.FavoriteActionTypes.RemoveFromListSuccess
    ),
    tap(() => {
      this.snackBar.open('Fjernet fra din liste', null, {
        duration: 2000
      });
    })
  );

  @Effect({ dispatch: false })
  error: Observable<Action> = this.actions.pipe(
    ofType<FavoriteActions.Error>(FavoriteActions.FavoriteActionTypes.Error),
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
