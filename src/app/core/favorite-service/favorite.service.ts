import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
import { filter, take, map, tap } from 'rxjs/operators';

import * as fromRoot from './../../+state/reducers';
import * as favoriteAction from '../../+state/actions/favorite.actions';
import { FavoriteList } from './../../models/favorite-list';
import { User } from './../../models/user.model';

@Injectable()
export class FavoriteService {
  private favoritesRef: AngularFirestoreCollection<FavoriteList>;

  constructor(
    private afs: AngularFirestore,
    private store: Store<fromRoot.State>
  ) {
    this.store
      .select(fromRoot.currentUser)
      .pipe(filter(user => user !== null))
      .subscribe((user: User) => {
        this.favoritesRef = afs
          .collection('users')
          .doc(user.uid)
          .collection('favorites');
        this.favoritesRef
          .valueChanges()
          .pipe(
            tap((lists: FavoriteList[]) =>
              this.store.dispatch(new favoriteAction.FetchListsSuccess(lists))
            )
          )
          .subscribe();
      });
  }

  public addList(name: string) {
    this.favoritesRef.doc(name).set({
      name: name,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
  }

  public addToList(favoriteList: FavoriteList) {
    favoriteList.items.forEach(i => {
      this.favoritesRef
        .doc(favoriteList.name)
        .collection('items')
        .doc(i.id)
        .set(i);
    });
  }
}
