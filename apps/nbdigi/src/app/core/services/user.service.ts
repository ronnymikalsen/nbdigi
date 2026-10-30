import { Injectable } from '@angular/core';
import {
  DocumentReference,
  Firestore,
  doc,
  getDoc,
  setDoc,
} from '@angular/fire/firestore';
import { User } from '../models';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userRef: DocumentReference<User> | undefined;

  constructor(private afs: Firestore) {}

  public createUserIfNotExists(user: User) {
    if (!user.uid) {
      return;
    }

    this.userRef = doc(
      this.afs,
      'users',
      user.uid,
    ) as DocumentReference<User>;

    void getDoc(this.userRef).then((snapshot) => {
      if (!snapshot.exists()) {
        return setDoc(this.userRef!, user);
      }
      return undefined;
    });
  }

  public updateUser(user: User) {
    if (this.userRef) {
      void setDoc(this.userRef, user, { merge: true });
    }
  }
}
