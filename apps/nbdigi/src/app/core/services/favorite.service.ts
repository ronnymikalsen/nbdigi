import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { Md5 } from 'ts-md5';
import { AuthFacade } from '../../+state/auth/auth.facade';
import { FavoriteFacade } from '../../+state/favorite/favorite.facade';
import { FavoriteList, Item, User } from '../../core/models';

@Injectable()
export class FavoriteService {
  private favoritesRef: AngularFirestoreCollection<FavoriteList>;

  constructor(
    private afs: AngularFirestore,
    private favoriteFacade: FavoriteFacade,
    private authFacade: AuthFacade
  ) {
    /*
    this.authFacade.currentUser$
      .pipe(filter((user) => user !== null))
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
                    this.favoriteFacade.setList({
                      id: list.id,
                      name: list.name,
                      items: i,
                    });
                  });
              }
            })
          )
          .subscribe();
      });
      */
  }

  public addList(name: string): Observable<void> {
    return Observable.create((observer) => {
      const id = <string>Md5.hashStr(name);
      this.favoritesRef
        .doc(id)
        .set({
          id: id,
          name: name,
        })
        .then(() => observer.next());
    });
  }

  public renameList(
    favoriteList: FavoriteList,
    newName: string
  ): Observable<void> {
    return Observable.create((observer) => {
      this.favoritesRef
        .doc(favoriteList.id)
        .update({
          name: newName,
        })
        .then(() => observer.next());
    });
  }

  public removeList(favoriteList: FavoriteList): Observable<void> {
    return Observable.create((observer) => {
      const batch = this.afs.firestore.batch();
      favoriteList.items.forEach((i) => {
        batch.delete(
          this.favoritesRef.doc(favoriteList.id).collection('items').doc(i.id)
            .ref
        );
      });
      batch.delete(this.favoritesRef.doc(favoriteList.id).ref);
      batch.commit().then(() => observer.next());
    });
  }

  public addToList(favoriteList: FavoriteList): Observable<void> {
    return Observable.create((observer) => {
      const batch = this.afs.firestore.batch();

      favoriteList.items.forEach((i) => {
        batch.set(
          this.favoritesRef.doc(favoriteList.id).collection('items').doc(i.id)
            .ref,
          {
            ...i,
            timestamp: firebase.default.firestore.FieldValue.serverTimestamp(),
          }
        );
      });
      batch.commit().then(() => observer.next());
    });
  }

  public removeFromList(favoriteList: FavoriteList): Observable<void> {
    return Observable.create((observer) => {
      const batch = this.afs.firestore.batch();

      favoriteList.items.forEach((i) => {
        batch.delete(
          this.favoritesRef.doc(favoriteList.id).collection('items').doc(i.id)
            .ref
        );
      });
      batch.commit().then(() => observer.next());
    });
  }
}
