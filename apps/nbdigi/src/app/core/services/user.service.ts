import { Injectable } from '@angular/core';
import { Auth, getAuth } from '@angular/fire/auth';
import { DocumentReference, Firestore, doc } from '@angular/fire/firestore';
import { filter } from 'rxjs/operators';
import { User } from '../models';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userRef: DocumentReference<User> | undefined;

  constructor(private afs: Firestore, private afAuth: Auth) {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      this.userRef = doc(afs, `users/${user.uid}`);
    }
  }

  public createUserIfNotExists(user: User) {
    if (this.userRef) {
      /*
      this.userRef.ref.get().then((u: any) => {
        if (!u.exists) {
          this.userRef.set(user);
        }
      });
      */
    }
  }

  public updateUser(user: User) {
    if (this.userRef) {
      /*
      this.userRef.ref.get().then((u: any) => {
        this.userRef.update(user);
      });
      */
    }
  }
}
