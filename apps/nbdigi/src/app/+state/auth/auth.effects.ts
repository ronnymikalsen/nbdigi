import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { AuthService, UserService } from '../../core/services';
import {
  AuthActionTypes,
  AuthError,
  SendPasswordResetEmail,
  SendPasswordResetEmaildSuccess,
  SignedOut,
  SignInWithEmailAndPassword,
  SignInWithEmailAndPasswordSuccess,
  SignInWithGoogle,
  SignInWithGoogleSuccess,
  SignOut,
  SignUpSuccess,
  SignUpWithEmailAndPassword,
} from './auth.actions';

@Injectable()
export class AuthEffects {
  signUpWithEmailAndPassword: Observable<Action> = createEffect(() =>
    this.actions.pipe(
      ofType(AuthActionTypes.SignUpWithEmailAndPassword),
      switchMap((action: SignUpWithEmailAndPassword) => {
        return this.authService
          .signUpWithEmailAndPassword(
            action.payload.email,
            action.payload.password,
          )
          .pipe(
            map((authState) => new SignUpSuccess()),
            catchError((err) => of(new AuthError(err))),
          );
      }),
    ),
  );

  signInWithGoogle: Observable<Action> = createEffect(() =>
    this.actions.pipe(
      ofType(AuthActionTypes.SignInWithGoogle),
      switchMap((action: SignInWithGoogle) => {
        return this.authService.signInWithGoogle().pipe(
          map((authState) => new SignInWithGoogleSuccess()),
          tap(() => this.ngZone.run(() => this.router.navigate(['/home']))),
          catchError((err) => of(new AuthError(err))),
        );
      }),
    ),
  );

  signInWithEmailAndPassword: Observable<Action> = createEffect(() =>
    this.actions.pipe(
      ofType(AuthActionTypes.SignInWithEmailAndPassword),
      switchMap((action: SignInWithEmailAndPassword) => {
        return this.authService
          .signInWithEmailAndPassword(
            action.payload.email,
            action.payload.password,
          )
          .pipe(
            map((authState) => new SignInWithEmailAndPasswordSuccess()),
            tap(() => this.ngZone.run(() => this.router.navigate(['/home']))),
            catchError((err) => of(new AuthError(err))),
          );
      }),
    ),
  );

  signedIn: Observable<Action> = createEffect(
    () =>
      this.actions.pipe(
        ofType(AuthActionTypes.SignedIn),
        map((action: any) => action.payload),
        tap((user) => this.userService.createUserIfNotExists(user)),
      ),
    { dispatch: false },
  );

  sendPasswordResetEmail: Observable<Action> = createEffect(() =>
    this.actions.pipe(
      ofType(AuthActionTypes.SendPasswordResetEmail),
      switchMap((action: SendPasswordResetEmail) => {
        return this.authService.sendPasswordResetEmail(action.payload).pipe(
          map((authState) => new SendPasswordResetEmaildSuccess()),
          catchError((err) => of(new AuthError(err))),
        );
      }),
    ),
  );

  sendPasswordResetEmaildSuccess: Observable<Action> = createEffect(
    () =>
      this.actions.pipe(
        ofType(AuthActionTypes.SendPasswordResetEmaildSuccess),
        tap(() => this.ngZone.run(() => this.router.navigate(['/auth']))),
      ),
    { dispatch: false },
  );

  signOut: Observable<Action> = createEffect(() =>
    this.actions.pipe(
      ofType(AuthActionTypes.SignOut),
      switchMap((action: SignOut) => {
        return this.authService.signOut().pipe(map(() => new SignedOut()));
      }),
    ),
  );

  signedOut: Observable<Action> = createEffect(
    () =>
      this.actions.pipe(
        ofType(AuthActionTypes.SignedOut),
        tap(() => this.ngZone.run(() => this.router.navigate(['/auth']))),
      ),
    { dispatch: false },
  );

  signUpSuccess: Observable<Action> = createEffect(
    () =>
      this.actions.pipe(
        ofType(AuthActionTypes.SignUpSuccess),
        tap(() => this.ngZone.run(() => this.router.navigate(['/home']))),
      ),
    { dispatch: false },
  );

  constructor(
    private ngZone: NgZone,
    private actions: Actions,
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
  ) {}
}
