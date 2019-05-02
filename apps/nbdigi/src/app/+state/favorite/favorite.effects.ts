import { Injectable } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, exhaustMap, map, take, tap } from 'rxjs/operators';
import { FavoriteList } from '../../core/models';
import { FavoriteService } from '../../core/services/favorite.service';
import { RemoveWarningDialogComponent } from '../../my-library/components/remove-warning-dialog/remove-warning-dialog.component';
import { AddToFavoriteListDialogComponent } from '../../my-library/containers/add-to-favorite-list-dialog/add-to-favorite-list-dialog.component';
import { RemoveFavoriteDialogComponent } from '../../my-library/shared/favorite-list-menu/favorite-list-menu-button/remove-favorite-dialog/remove-favorite-dialog.component';
import { RenameFavoriteDialogComponent } from '../../my-library/shared/favorite-list-menu/favorite-list-menu-button/rename-favorite-dialog/rename-favorite-dialog.component';
import {
  AddList,
  AddListSuccess,
  AddToList,
  AddToListCancelled,
  AddToListSuccess,
  Error,
  FavoriteActionTypes,
  OpenAddToListDialog,
  OpenList,
  OpenRenameListDialog,
  RemoveFromList,
  RemoveFromListCancelled,
  RemoveFromListConfirmed,
  RemoveFromListSuccess,
  RemoveList,
  RemoveListCancelled,
  RemoveListConfirmed,
  RemoveListSuccess,
  RenameList,
  RenameListSuccess
} from './favorite.actions';

@Injectable()
export class FavoriteEffects {
  @Effect()
  openAddToListDialog: Observable<Action> = this.actions.pipe(
    ofType(FavoriteActionTypes.OpenAddToListDialog),
    map(action => action),
    exhaustMap((action: OpenAddToListDialog) =>
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
              return new AddToList(result);
            } else {
              return new AddToListCancelled();
            }
          })
        )
    ),
    catchError(err => of(new Error(err)))
  );

  @Effect()
  addToList: Observable<Action> = this.actions.pipe(
    ofType<AddToList>(FavoriteActionTypes.AddToList),
    map(action => action.payload),
    exhaustMap((favoriteList: FavoriteList) =>
      this.favoriteService.addToList(favoriteList).pipe(
        take(1),
        map(() => {
          return new AddToListSuccess();
        })
      )
    ),
    catchError(err => of(new Error(err)))
  );

  @Effect({ dispatch: false })
  addToListSuccess: Observable<Action> = this.actions.pipe(
    ofType(FavoriteActionTypes.AddToListSuccess),
    tap(() => {
      this.snackBar.open('Lagt til i din liste', null, {
        duration: 2000
      });
    })
  );

  @Effect({ dispatch: false })
  openList: Observable<Action> = this.actions.pipe(
    ofType<OpenList>(FavoriteActionTypes.OpenList),
    tap((action: OpenList) =>
      this.router.navigate(['/mylibrary', action.payload])
    )
  );

  @Effect()
  addList: Observable<Action> = this.actions.pipe(
    ofType<AddList>(FavoriteActionTypes.AddList),
    map(action => action.payload),
    exhaustMap((listName: string) =>
      this.favoriteService
        .addList(listName)
        .pipe(map(() => new AddListSuccess()))
    ),
    catchError(err => of(new Error(err)))
  );

  @Effect({ dispatch: false })
  addListSuccess: Observable<Action> = this.actions.pipe(
    ofType<AddList>(FavoriteActionTypes.AddList),
    tap(() => {
      this.snackBar.open('Ny liste er lagret', null, {
        duration: 2000
      });
    })
  );

  @Effect()
  openRenameListDialog: Observable<Action> = this.actions.pipe(
    ofType<OpenRenameListDialog>(FavoriteActionTypes.OpenRenameListDialog),
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
              return new RenameList(result);
            } else {
              return new AddToListCancelled();
            }
          })
        )
    ),
    catchError(err => of(new Error(err)))
  );

  @Effect()
  renameList: Observable<Action> = this.actions.pipe(
    ofType<RenameList>(FavoriteActionTypes.RenameList),
    map(action => action.payload),
    exhaustMap((result: any) =>
      this.favoriteService.renameList(result.favoriteList, result.newName).pipe(
        take(1),
        map(() => new RenameListSuccess())
      )
    )
  );

  @Effect({ dispatch: false })
  renameListSuccess: Observable<Action> = this.actions.pipe(
    ofType<RemoveListSuccess>(FavoriteActionTypes.RenameListSuccess),
    tap(() => {
      this.snackBar.open('Listen har fått nytt navn', null, {
        duration: 2000
      });
    })
  );

  @Effect()
  removeList: Observable<Action> = this.actions.pipe(
    ofType<RemoveList>(FavoriteActionTypes.RemoveList),
    map(action => action),
    exhaustMap((action: RemoveList) =>
      this.dialog
        .open(RemoveFavoriteDialogComponent, { data: action.payload })
        .afterClosed()
        .pipe(
          map(result => {
            if (result) {
              return new RemoveListConfirmed(action.payload);
            } else {
              return new RemoveListCancelled();
            }
          })
        )
    )
  );

  @Effect()
  removeListConfirmed: Observable<Action> = this.actions.pipe(
    ofType<RemoveListConfirmed>(FavoriteActionTypes.RemoveListConfirmed),
    map(action => action.payload),
    exhaustMap((favoriteList: FavoriteList) => {
      if (favoriteList) {
        return this.favoriteService.removeList(favoriteList).pipe(
          take(1),
          map(() => new RemoveListSuccess(favoriteList)),
          catchError(err => of(new Error(err)))
        );
      } else {
        return of(new RemoveListCancelled());
      }
    })
  );

  @Effect({ dispatch: false })
  removeListSuccess: Observable<Action> = this.actions.pipe(
    ofType<RemoveListSuccess>(FavoriteActionTypes.RemoveListSuccess),
    tap(() => {
      this.snackBar.open('Listen er slettet', null, {
        duration: 2000
      });
      this.router.navigate(['/mylibrary']);
    })
  );

  @Effect()
  removeFromList: Observable<Action> = this.actions.pipe(
    ofType<RemoveFromList>(FavoriteActionTypes.RemoveFromList),
    map(action => action.payload),
    exhaustMap((favoriteList: FavoriteList) =>
      this.dialog
        .open(RemoveWarningDialogComponent, { data: favoriteList.items[0] })
        .afterClosed()
        .pipe(
          map(result => {
            if (result) {
              return new RemoveFromListConfirmed(favoriteList);
            } else {
              return new RemoveFromListCancelled();
            }
          })
        )
    ),
    catchError(err => of(new Error(err)))
  );

  @Effect()
  removeFromListConfirmed: Observable<Action> = this.actions.pipe(
    ofType<RemoveFromListConfirmed>(
      FavoriteActionTypes.RemoveFromListConfirmed
    ),
    map(action => action.payload),
    exhaustMap((favoriteList: FavoriteList) =>
      this.favoriteService
        .removeFromList(favoriteList)
        .pipe(map(() => new RemoveFromListSuccess()))
    ),
    catchError(err => of(new Error(err)))
  );

  @Effect({ dispatch: false })
  removeFromListSuccess: Observable<Action> = this.actions.pipe(
    ofType<RemoveFromListSuccess>(FavoriteActionTypes.RemoveFromListSuccess),
    tap(() => {
      this.snackBar.open('Fjernet fra din liste', null, {
        duration: 2000
      });
    })
  );

  @Effect({ dispatch: false })
  error: Observable<Action> = this.actions.pipe(
    ofType<Error>(FavoriteActionTypes.Error),
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
