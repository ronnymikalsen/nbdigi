import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs/operators';
import * as fromRoot from '../../+state/reducers';
import { User } from '../models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userRef: AngularFirestoreDocument<User>;

  constructor(
    private store: Store<fromRoot.State>,
    private afs: AngularFirestore
  ) {
    this.store
      .select(fromRoot.currentUser)
      .pipe(filter(user => user !== null))
      .subscribe((user: User) => {
        this.userRef = afs.doc<User>(`users/${user.uid}`);
      });
  }

  public createUserIfNotExists(user: User) {
    this.userRef.ref.get().then(u => {
      if (!u.exists) {
        this.userRef.set(user);
      }
    });
  }
}
