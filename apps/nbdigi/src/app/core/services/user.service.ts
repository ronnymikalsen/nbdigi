import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import { filter } from 'rxjs/operators';
import { AuthFacade } from '../../+state/auth/auth.facade';
import { User } from '../models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userRef: AngularFirestoreDocument<User>;

  constructor(private authFacade: AuthFacade, private afs: AngularFirestore) {}

  public createUserIfNotExists(user: User) {
    this.setUserRef();
    if (this.userRef) {
      this.userRef.ref.get().then(u => {
        if (!u.exists) {
          this.userRef.set(user);
        }
      });
    }
  }

  private setUserRef() {
    this.authFacade.currentUser$
      .pipe(filter(user => user !== null))
      .subscribe((user: User) => {
        this.userRef = this.afs.doc<User>(`users/${user.uid}`);
      });
  }
}
