import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import * as firebase from 'firebase/app';
import { Observable, of } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
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
  OpenItemDetails
} from './item.actions';

@Injectable()
export class ItemEffects {
  private itemsRef: AngularFirestoreCollection<Item>;

  @Effect({ dispatch: false })
  open: Observable<Action> = this.actions.pipe(
    ofType(ItemActionTypes.Open),
    map(action => action),
    tap((action: Open) => this.viewerService.open(action.payload))
  );

  @Effect({ dispatch: false })
  change: Observable<Action> = this.actions.pipe(
    ofType(ItemActionTypes.Change),
    map(action => action),
    tap((action: Change) =>
      this.itemsRef.doc(action.payload.id).set({
        ...action.payload,
        timestamp: firebase.firestore.Timestamp.now()
      })
    )
  );

  @Effect()
  openItemDetails$: Observable<Action> = this.actions.pipe(
    ofType<OpenItemDetails>(ItemActionTypes.OpenItemDetails),
    map(action => action.payload),
    switchMap((item: Item) =>
      this.presentationService.getManifest(item.manifestUri, ['metadata']).pipe(
        map((manifest: Manifest) => new LoadItemDetailsSuccess(manifest)),
        catchError(err => of(new LoadItemDetailsFailure(err)))
      )
    )
  );

  constructor(
    private actions: Actions,
    private viewerService: ViewerService,
    private presentationService: PresentationService,
    private authFacade: AuthFacade,
    afs: AngularFirestore
  ) {
    this.authFacade.currentUser$
      .pipe(filter(user => user !== null))
      .subscribe((user: User) => {
        this.itemsRef = afs
          .collection('users')
          .doc(user.uid)
          .collection('items');
      });
  }
}
