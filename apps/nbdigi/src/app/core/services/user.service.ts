import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import { filter } from 'rxjs/operators';
import { AuthFacade } from '../../+state/auth/auth.facade';
import { User } from '../models';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userRef: AngularFirestoreDocument<User>;

  constructor(private authFacade: AuthFacade, private afs: AngularFirestore,private afAuth: AngularFireAuth) {
    this.afAuth.authState.pipe().subscribe( authState => {
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
