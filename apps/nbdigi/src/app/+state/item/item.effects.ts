import { Injectable } from '@angular/core';
import {
  CollectionReference,
  Firestore,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from '@angular/fire/firestore';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Item, User } from '../../core/models';
import { Manifest } from '../../core/models/manifest';
import { PresentationService } from '../../core/services/presentation.service';
import { ViewerService } from '../../core/services/viewer.service';
import { AuthFacade } from '../auth/auth.facade';
import {
  Change,
  ItemActionTypes,
  LoadItemDetailsFailure,
  LoadItemDetailsSuccess,
  Open,
  OpenItemDetails,
} from './item.actions';

@Injectable()
export class ItemEffects {
  private itemsRef: CollectionReference<Item> | undefined;

  open: Observable<Action> = createEffect(
    () =>
      this.actions.pipe(
        ofType(ItemActionTypes.Open),
        map((action) => action),
        tap((action: Open) => this.viewerService.open(action.payload)),
      ),
    { dispatch: false },
  );

  change: Observable<Action> = createEffect(
    () =>
      this.actions.pipe(
        ofType(ItemActionTypes.Change),
        map((action) => action),
        tap((action: Change) => {
          if (this.itemsRef && action.payload?.id) {
            void setDoc(doc(this.itemsRef, action.payload.id), {
              ...action.payload,
              timestamp: serverTimestamp(),
            });
          }
        }),
      ),
    { dispatch: false },
  );

  openItemDetails$: Observable<Action> = createEffect(() =>
    this.actions.pipe(
      ofType<OpenItemDetails>(ItemActionTypes.OpenItemDetails),
      map((action) => action.payload),
      switchMap((item: Item) => {
        if (item.manifestUri === null)
          return of(new LoadItemDetailsFailure('error'));

        return this.presentationService
          .getManifest(item.manifestUri, ['metadata'])
          .pipe(
            map((manifest: Manifest) => new LoadItemDetailsSuccess(manifest)),
            catchError((err) => of(new LoadItemDetailsFailure(err))),
          );
      }),
    ),
  );

  constructor(
    private actions: Actions,
    private viewerService: ViewerService,
    private presentationService: PresentationService,
    private authFacade: AuthFacade,
    afs: Firestore,
  ) {
    this.authFacade.currentUser$.subscribe((user: User | null | undefined) => {
      if (user?.uid) {
        this.itemsRef = collection(
          afs,
          'users',
          user.uid,
          'items',
        ) as CollectionReference<Item>;
      }
    });
  }
}
