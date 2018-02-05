import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { switchMap, tap, map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

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

@Injectable()
export class SessionEffects {

  @Effect()
  signUpWithEmailAndPassword: Observable<Action> = this.actions.ofType(AuthActionTypes.SignUpWithEmailAndPassword).pipe(
    switchMap((action: SignUpWithEmailAndPassword) => {
      return this.authService
        .signUpWithEmailAndPassword(action.payload.email, action.payload.password)
        .pipe(
          map((authState) => new SignUpSuccess()),
          catchError((err) => of(new AuthError(err)))
        );
    })
  );

  @Effect()
  signInWithGoogle: Observable<Action> = this.actions.ofType(AuthActionTypes.SignInWithGoogle).pipe(
    switchMap((action: SignInWithGoogle) => {
      return this.authService
      .signInWithGoogle()
      .pipe(
        map((authState) => new SignInWithGoogleSuccess()),
        catchError((err) => of(new AuthError(err)))
      );
    })
  );

  @Effect()
  signInWithEmailAndPassword: Observable<Action> = this.actions.ofType(AuthActionTypes.SignInWithEmailAndPassword).pipe(
    switchMap((action: SignInWithEmailAndPassword) => {
      return this.authService
        .signInWithEmailAndPassword(action.payload.email, action.payload.password)
        .pipe(
          map((authState) => new SignInWithEmailAndPasswordSuccess()),
          catchError((err) => of(new AuthError(err)))
        );
    })
  );

  @Effect({ dispatch: false })
  signedIn: Observable<Action> = this.actions.ofType(AuthActionTypes.SignedIn).pipe(
    tap(() => this.router.navigate(['/home']))
  );

  @Effect()
  sendPasswordResetEmail: Observable<Action> = this.actions.ofType(AuthActionTypes.SendPasswordResetEmail).pipe(
    switchMap((action: SendPasswordResetEmail) => {
      return this.authService
        .sendPasswordResetEmail(action.payload)
        .pipe(
          map((authState) => new SendPasswordResetEmaildSuccess()),
          catchError((err) => of(new AuthError(err)))
        );
    })
  );

  @Effect({ dispatch: false })
  sendPasswordResetEmaildSuccess: Observable<Action> = this.actions.ofType(AuthActionTypes.SendPasswordResetEmaildSuccess)
    .pipe(
      tap(() => this.router.navigate(['/login']))
    );

    @Effect()
  signOut: Observable<Action> = this.actions.ofType(AuthActionTypes.SignOut).pipe(
    switchMap((action: SignOut) => {
      return this.authService.signOut().map(() => new SignedOut());
    })
  );

  @Effect({ dispatch: false })
  signedOut: Observable<Action> = this.actions.ofType(AuthActionTypes.SignedOut)
    .pipe(
      tap(() => this.router.navigate(['/login']))
    );

  constructor(
    private actions: Actions,
    private router: Router,
    private authService: AuthService
  ) { }
}
