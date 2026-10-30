import { Injectable } from '@angular/core';
import {
  CollectionReference,
  Firestore,
  collection,
  collectionData,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
} from '@angular/fire/firestore';

import { Observable, combineLatest, from, of, throwError } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Md5 } from 'ts-md5';
import { AuthFacade } from '../../+state/auth/auth.facade';
import { FavoriteFacade } from '../../+state/favorite/favorite.facade';
import { FavoriteList, Item } from '../../core/models';

@Injectable()
export class FavoriteService {
  private favoritesRef: CollectionReference | undefined;

  constructor(
    private afs: Firestore,
    private favoriteFacade: FavoriteFacade,
    private authFacade: AuthFacade,
  ) {
    this.authFacade.currentUser$
      .pipe(
        switchMap((user) => {
          if (!user?.uid) {
            this.favoritesRef = undefined;
            return of([] as FavoriteList[]);
          }

          this.favoritesRef = collection(
            afs,
            'users',
            user.uid,
            'favorites',
          );

          return collectionData(this.favoritesRef, {
            idField: 'id',
          }) as Observable<FavoriteList[]>;
        }),
        switchMap((lists) => {
          if (!this.favoritesRef || lists.length === 0) {
            return of([] as FavoriteList[]);
          }

          return combineLatest(
            lists.map((list) => {
              const itemsRef = collection(
                doc(this.favoritesRef!, list.id),
                'items',
              );
              return (
                collectionData(itemsRef, {
                  idField: 'id',
                }) as Observable<Item[]>
              ).pipe(
                map((items) => ({
                  ...list,
                  items,
                  timestamp: list.timestamp ?? null,
                })),
              );
            }),
          );
        }),
      )
      .subscribe((lists) => {
        for (const list of lists) {
          this.favoriteFacade.setList(list);
        }
      });
  }

  public addList(name: string): Observable<void> {
    if (!this.favoritesRef) {
      return this.notSignedIn();
    }

    const id = <string>Md5.hashStr(name);
    return from(
      setDoc(doc(this.favoritesRef, id), {
        id,
        name,
        timestamp: serverTimestamp(),
      }),
    );
  }

  public renameList(
    favoriteList: FavoriteList,
    newName: string,
  ): Observable<void> {
    if (!this.favoritesRef) {
      return this.notSignedIn();
    }

    return from(
      updateDoc(doc(this.favoritesRef, favoriteList.id), { name: newName }),
    );
  }

  public removeList(favoriteList: FavoriteList): Observable<void> {
    if (!this.favoritesRef) {
      return this.notSignedIn();
    }

    const batch = writeBatch(this.afs);
    const favoriteRef = doc(this.favoritesRef, favoriteList.id);
    for (const item of favoriteList.items) {
      if (item.id) {
        batch.delete(doc(collection(favoriteRef, 'items'), item.id));
      }
    }
    batch.delete(favoriteRef);
    return from(batch.commit());
  }

  public addToList(favoriteList: FavoriteList): Observable<void> {
    if (!this.favoritesRef) {
      return this.notSignedIn();
    }

    const batch = writeBatch(this.afs);
    const favoriteRef = doc(this.favoritesRef, favoriteList.id);
    for (const item of favoriteList.items) {
      if (item.id) {
        batch.set(doc(collection(favoriteRef, 'items'), item.id), {
          ...item,
          timestamp: serverTimestamp(),
        });
      }
    }
    return from(batch.commit());
  }

  public removeFromList(favoriteList: FavoriteList): Observable<void> {
    if (!this.favoritesRef) {
      return this.notSignedIn();
    }

    const batch = writeBatch(this.afs);
    const favoriteRef = doc(this.favoritesRef, favoriteList.id);
    for (const item of favoriteList.items) {
      if (item.id) {
        batch.delete(doc(collection(favoriteRef, 'items'), item.id));
      }
    }
    return from(batch.commit());
  }

  private notSignedIn(): Observable<never> {
    return throwError(() => new Error('A signed-in user is required'));
  }
}
