import { Injectable } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
} from '@angular/fire/auth';
import firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { AuthError } from '../../core/models';

@Injectable()
export class AuthService {
  constructor(private afAuth: Auth) {}

  signUpWithEmailAndPassword(email: string, password: string): Observable<any> {
    return Observable.create((observer: any) => {
      createUserWithEmailAndPassword(this.afAuth, email, password)
        .then((res: any) => {
          observer.next(res);
        })
        .catch((err: any) => {
          observer.error(err);
        });
    });
  }

  signInWithEmailAndPassword(email: string, password: string): Observable<any> {
    return Observable.create((observer: any) => {
      signInWithEmailAndPassword(this.afAuth, email, password)
        .then((res: any) => {
          observer.next(res);
        })
        .catch((err: AuthError) => {
          observer.error(err);
        });
    });
  }

  signInWithGoogle(): Observable<any> {
    return Observable.create((observer: any) => {
      signInWithPopup(this.afAuth, new GoogleAuthProvider())
        .then((res: any) => {
          observer.next(res);
        })
        .catch((err: any) => {
          observer.error(err);
        });
    });
  }

  sendPasswordResetEmail(email: string): Observable<any> {
    return Observable.create((observer: any) => {
      sendPasswordResetEmail(this.afAuth, email)
        .then((res: any) => {
          observer.next(res);
        })
        .catch((err: any) => {
          observer.error(err);
        });
    });
  }

  confirmPasswordReset(code: string, newPassword: string): Observable<any> {
    return Observable.create((observer: any) => {
      confirmPasswordReset(this.afAuth, code, newPassword)
        .then((res: any) => {
          observer.next(res);
        })
        .catch((err: any) => {
          observer.error(err);
        });
    });
  }

  signOut(): Observable<any> {
    return Observable.create((observer: any) => {
      this.afAuth
        .signOut()
        .then((res: any) => {
          observer.next(res);
        })
        .catch((err: any) => {
          observer.error(err);
        });
    });
  }
}
