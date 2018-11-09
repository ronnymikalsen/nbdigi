import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';
import { Item, User } from '@nbdigi/data-models';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import * as firebase from 'firebase';
import { Observable, of } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { Manifest } from '../../core/presentation-service/manifest';
import { PresentationService } from '../../core/presentation-service/presentation.service';
import { ViewerService } from '../../core/viewer-service/viewer.service';
import { ItemActions, PresentationApiActions } from '../actions';
import { Change, ItemActionTypes, Open } from '../actions/item.actions';
import * as fromRoot from '../reducers';

@Injectable()
export class ItemEffects {
  private itemsRef: AngularFirestoreCollection<Item>;

  @Effect({ dispatch: false })
  open: Observable<Action> = this.actions$.pipe(
    ofType(ItemActionTypes.Open),
    map(action => action),
    tap((action: Open) => this.viewerService.open(action.payload))
  );

  @Effect({ dispatch: false })
  change: Observable<Action> = this.actions$.pipe(
    ofType(ItemActionTypes.Change),
    map(action => action),
    tap((action: Change) =>
      this.itemsRef.doc(action.payload.id).set({
        ...action.payload,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      })
    )
  );

  @Effect()
  openItemDetails$: Observable<Action> = this.actions$.pipe(
    ofType<ItemActions.OpenItemDetails>(ItemActionTypes.OpenItemDetails),
    map(action => action.payload),
    switchMap((item: Item) =>
      this.presentationService.getManifest(item.manifestUri, ['metadata']).pipe(
        map(
          (manifest: Manifest) =>
            new PresentationApiActions.LoadSuccess(manifest)
        ),
        catchError(err => of(new PresentationApiActions.LoadFailure(err)))
      )
    )
  );

  constructor(
    private actions$: Actions,
    private viewerService: ViewerService,
    private presentationService: PresentationService,
    private store: Store<fromRoot.State>,
    afs: AngularFirestore
  ) {
    this.store
      .select(fromRoot.currentUser)
      .pipe(filter(user => user !== null))
      .subscribe((user: User) => {
        this.itemsRef = afs
          .collection('users')
          .doc(user.uid)
          .collection('items');
      });
  }
}
