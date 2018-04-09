import { isDebugOn } from './../reducers/index';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Action, Store } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { switchMap, tap, map, filter } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from 'angularfire2/firestore';

import * as fromAuth from './../reducers/session.reducer';
import {
  AuthActionTypes,
  SignUpWithEmailAndPassword,
  SignInWithGoogle,
  SignInWithEmailAndPassword,
  SignedIn,
  SignOut,
  SignedOut,
  AuthError,
  SignUpSuccess,
  SignInWithGoogleSuccess,
  SignInWithEmailAndPasswordSuccess,
  SendPasswordResetEmail,
  SendPasswordResetEmaildSuccess
} from './../actions/session.actions';
import { AuthService } from './../../core/auth-service/auth.service';
import { User } from '../../models/user.model';
import * as fromRoot from './../reducers';

@Injectable()
export class SessionEffects {
  private userRef: AngularFirestoreDocument<User>;
  private user: User;

  @Effect()
  signUpWithEmailAndPassword: Observable<Action> = this.actions
    .ofType(AuthActionTypes.SignUpWithEmailAndPassword)
    .pipe(
      switchMap((action: SignUpWithEmailAndPassword) => {
        return this.authService
          .signUpWithEmailAndPassword(
            action.payload.email,
            action.payload.password
          )
          .pipe(
            map(authState => new SignUpSuccess()),
            catchError(err => of(new AuthError(err)))
          );
      })
    );

  @Effect()
  signInWithGoogle: Observable<Action> = this.actions
    .ofType(AuthActionTypes.SignInWithGoogle)
    .pipe(
      switchMap((action: SignInWithGoogle) => {
        return this.authService
          .signInWithGoogle()
          .pipe(
            map(authState => new SignInWithGoogleSuccess()),
            tap(() => this.router.navigate(['/home'])),
            catchError(err => of(new AuthError(err)))
          );
      })
    );

  @Effect()
  signInWithEmailAndPassword: Observable<Action> = this.actions
    .ofType(AuthActionTypes.SignInWithEmailAndPassword)
    .pipe(
      switchMap((action: SignInWithEmailAndPassword) => {
        return this.authService
          .signInWithEmailAndPassword(
            action.payload.email,
            action.payload.password
          )
          .pipe(
            map(authState => new SignInWithEmailAndPasswordSuccess()),
            tap(() => this.router.navigate(['/home'])),
            catchError(err => of(new AuthError(err)))
          );
      })
    );

  @Effect({ dispatch: false })
  signedIn: Observable<Action> = this.actions
    .ofType(AuthActionTypes.SignedIn)
    .pipe(
      map((action: any) => action.payload),
      tap(user => this.createUserIfNotExists(user))
      //tap(() => this.router.navigate(['/home']))
    );

  @Effect()
  sendPasswordResetEmail: Observable<Action> = this.actions
    .ofType(AuthActionTypes.SendPasswordResetEmail)
    .pipe(
      switchMap((action: SendPasswordResetEmail) => {
        return this.authService
          .sendPasswordResetEmail(action.payload)
          .pipe(
            map(authState => new SendPasswordResetEmaildSuccess()),
            catchError(err => of(new AuthError(err)))
          );
      })
    );

  @Effect({ dispatch: false })
  sendPasswordResetEmaildSuccess: Observable<Action> = this.actions
    .ofType(AuthActionTypes.SendPasswordResetEmaildSuccess)
    .pipe(tap(() => this.router.navigate(['/login'])));

  @Effect()
  signOut: Observable<Action> = this.actions
    .ofType(AuthActionTypes.SignOut)
    .pipe(
      switchMap((action: SignOut) => {
        return this.authService.signOut().map(() => new SignedOut());
      })
    );

  @Effect({ dispatch: false })
  signedOut: Observable<Action> = this.actions
    .ofType(AuthActionTypes.SignedOut)
    .pipe(tap(() => this.router.navigate(['/login'])));

  @Effect({ dispatch: false })
  debugOn: Observable<Action> = this.actions
    .ofType(AuthActionTypes.DebugOn)
    .pipe(
      tap(() =>
        this.userRef.update({
          isDebugOn: true
        })
      )
    );

  @Effect({ dispatch: false })
  debugOff: Observable<Action> = this.actions
    .ofType(AuthActionTypes.DebugOff)
    .pipe(
      tap(() =>
        this.userRef.update({
          isDebugOn: false
        })
      )
    );

  constructor(
    private actions: Actions,
    private router: Router,
    private authService: AuthService,
    private afs: AngularFirestore,
    private store: Store<fromRoot.State>
  ) {
    this.store
      .select(fromRoot.currentUser)
      .pipe(filter(user => user !== null))
      .subscribe((user: User) => {
        this.user = user;
        this.userRef = afs.doc<User>(`users/${user.uid}`);
      });
  }

  private createUserIfNotExists(user: User) {
    this.userRef.ref.get().then(u => {
      if (!u.exists) {
        this.userRef.set(user);
      }
    });
  }
}
