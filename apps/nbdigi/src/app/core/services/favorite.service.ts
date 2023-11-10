import { Injectable } from '@angular/core';
import {
  CollectionReference,
  Firestore,
  collection,
  getDoc,
  serverTimestamp,
  updateDoc,
  DocumentReference,
  doc
} from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import { Md5 } from 'ts-md5';
import { AuthFacade } from '../../+state/auth/auth.facade';
import { FavoriteFacade } from '../../+state/favorite/favorite.facade';
import { FavoriteList } from '../../core/models';

@Injectable()
export class FavoriteService {
  private favoritesRef: DocumentReference<FavoriteList>  | undefined;

  constructor(
    private afs: Firestore,
    private favoriteFacade: FavoriteFacade,
    private authFacade: AuthFacade
  ) {
      const test = serverTimestamp();

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
    return Observable.create((observer: any) => {
      const id = <string>Md5.hashStr(name);
      /*
      this.favoritesRef
        .doc(id)
        .set({
          id: id,
          name: name,
        })
        .then(() => observer.next());
        */
    });
  }

  public renameList(
    favoriteList: FavoriteList,
    newName: string
  ): Observable<void> {
    return Observable.create((observer: any) => {
      /*
      this.favoritesRef
        .doc(favoriteList.id)
        .update({
          name: newName,
        })
        .then(() => observer.next());
        */
    });
  }

  public removeList(favoriteList: FavoriteList): Observable<void> {
    return Observable.create((observer: any) => {
      /*
      const batch = this.afs.firestore.batch();
      favoriteList.items.forEach((i) => {
        batch.delete(
          this.favoritesRef.doc(favoriteList.id).collection('items').doc(i.id)
            .ref
        );
      });
      batch.delete(this.favoritesRef.doc(favoriteList.id).ref);
      batch.commit().then(() => observer.next());
      */
    });
  }

  public addToList(favoriteList: FavoriteList): Observable<void> {
    return Observable.create((observer: any) => {
      /*
      const batch = this.afs.firestore.batch();

      favoriteList.items.forEach((i) => {
        batch.set(
          this.favoritesRef.doc(favoriteList.id).collection('items').doc(i.id)
            .ref,
          {
            ...i,
            timestamp: serverTimestamp(),
          }
        );
      });
      batch.commit().then(() => observer.next());
      */
    });
  }

  public removeFromList(favoriteList: FavoriteList): Observable<void> {
    return Observable.create((observer: any) => {
      /*
      const batch = this.afs.firestore.batch();

      favoriteList.items.forEach((i) => {
        batch.delete(
          this.favoritesRef.doc(favoriteList.id).collection('items').doc(i.id)
            .ref
        );
      });
      batch.commit().then(() => observer.next());
      */
    });
  }
}
