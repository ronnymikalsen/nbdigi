import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from 'angularfire2/firestore';
import { Md5 } from 'ts-md5/dist/md5';
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
    const id = <string>Md5.hashStr(name);
    this.favoritesRef.doc(id).set({
      id: id,
      name: name,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
  }

  public addToList(favoriteList: FavoriteList) {
    console.log('addToList');
    favoriteList.items.forEach(i => {
      this.favoritesRef
        .doc(favoriteList.id)
        .collection('items')
        .doc(i.id)
        .set(i);
    });
  }

  public removeFromList(favoriteList: FavoriteList) {
    console.log('removeFromList');
    favoriteList.items.forEach(i => {
      console.log('removing item', i);
      console.log('removing from list', favoriteList.id);
      this.favoritesRef
        .doc(favoriteList.id)
        .collection('items')
        .doc(i.id)
        .delete();
    });
  }

  public getItems(id: string) {
    return this.favoritesRef.doc(id).collection('items');
  }
}
