import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { AuthError } from '../../core/models';

@Injectable()
export class AuthService {
  constructor(private afAuth: AngularFireAuth) {}

  signUpWithEmailAndPassword(email: string, password: string): Observable<any> {
    return Observable.create(observer => {
      this.afAuth.auth
        .createUserWithEmailAndPassword(email, password)
        .then(res => {
          observer.next(res);
        })
        .catch(err => {
          observer.error(err);
        });
    });
  }

  signInWithEmailAndPassword(email: string, password: string): Observable<any> {
    return Observable.create(observer => {
      this.afAuth.auth
        .signInWithEmailAndPassword(email, password)
        .then(res => {
          observer.next(res);
        })
        .catch((err: AuthError) => {
          observer.error(err);
        });
    });
  }

  signInWithGoogle(): Observable<any> {
    return Observable.create(observer => {
      this.afAuth.auth
        .signInWithPopup(new firebase.auth.GoogleAuthProvider())
        .then(res => {
          observer.next(res);
        })
        .catch(err => {
          observer.error(err);
        });
    });
  }

  sendPasswordResetEmail(email: string): Observable<any> {
    return Observable.create(observer => {
      this.afAuth.auth
        .sendPasswordResetEmail(email)
        .then(res => {
          observer.next(res);
        })
        .catch(err => {
          observer.error(err);
        });
    });
  }

  confirmPasswordReset(code: string, newPassword: string): Observable<any> {
    return Observable.create(observer => {
      this.afAuth.auth
        .confirmPasswordReset(code, newPassword)
        .then(res => {
          observer.next(res);
        })
        .catch(err => {
          observer.error(err);
        });
    });
  }

  signOut(): Observable<any> {
    return Observable.create(observer => {
      this.afAuth.auth
        .signOut()
        .then(res => {
          observer.next(res);
        })
        .catch(err => {
          observer.error(err);
        });
    });
  }
}
