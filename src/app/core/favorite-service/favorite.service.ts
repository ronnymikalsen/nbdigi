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
import { Item } from '../../models/search-result.model';

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
            tap((lists: FavoriteList[]) => {
              for (const list of lists) {
                this.favoritesRef
                  .doc(list.id)
                  .collection('items')
                  .valueChanges()
                  .subscribe((i: Item[]) => {
                    this.store.dispatch(
                      new favoriteAction.SetList({
                        id: list.id,
                        name: list.name,
                        items: i
                      })
                    );
                  });
              }
            })
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

  public renameList(
    favoriteList: FavoriteList,
    newName: string
  ): Promise<void> {
    return this.favoritesRef.doc(favoriteList.id).update({
      name: newName
    });
  }

  public addToList(favoriteList: FavoriteList) {
    favoriteList.items.forEach(i => {
      this.favoritesRef
        .doc(favoriteList.id)
        .collection('items')
        .doc(i.id)
        .set(i);
    });
  }

  public removeFromList(favoriteList: FavoriteList) {
    favoriteList.items.forEach(i => {
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
