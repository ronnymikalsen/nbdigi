import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { PresentationService, SessionService } from '@nbdigi/backend';
import { Item, Manifest } from '@nbdigi/data-models';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import {
  Change,
  ItemActionTypes,
  LoadFailure,
  LoadSuccess,
  OpenItemDetails
} from './item.actions';

@Injectable()
export class ItemEffects {
  @Effect({ dispatch: false })
  open: Observable<Action> = this.actions$.pipe(
    ofType(ItemActionTypes.Open),
    map(action => action),
    tap((action: Open) =>
      this.dialog.open(ViewerPageComponent, {
        width: '100%',
        height: '100%',
        data: action.payload,
        panelClass: ['viewer-panel']
      })
    )
  );

  @Effect({ dispatch: false })
  change: Observable<Action> = this.actions$.pipe(
    ofType(ItemActionTypes.Change),
    map(action => action),
    tap((action: Change) => this.sessionService.updateItem(action.payload))
  );

  @Effect()
  openItemDetails$: Observable<Action> = this.actions$.pipe(
    ofType<OpenItemDetails>(ItemActionTypes.OpenItemDetails),
    map(action => action.payload),
    switchMap((item: Item) =>
      this.presentationService.getManifest(item.manifestUri, ['metadata']).pipe(
        map((manifest: Manifest) => new LoadSuccess(manifest)),
        catchError(err => of(new LoadFailure(err)))
      )
    )
  );

  constructor(
    private actions$: Actions,
    private dialog: MatDialog,
    private presentationService: PresentationService,
    private sessionService: SessionService
  ) {}
}
