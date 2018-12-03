import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import { User } from '../models';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userRef: AngularFirestoreDocument<User>;

  constructor(private afs: AngularFirestore, private afAuth: AngularFireAuth) {
    this.afAuth.authState.pipe(
      filter(user => user !== null)
    ).subscribe(authState => {
      this.userRef = this.afs.doc<User>(`users/${authState.uid}`);
    });
  }

  public createUserIfNotExists(user: User) {
    if (this.userRef) {
      this.userRef.ref.get().then(u => {
        if (!u.exists) {
          this.userRef.set(user);
        }
      });
    }
  }
}
