import { Injectable } from '@angular/core';
import { AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { User } from 'firebase';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { AuthService, UserService } from '../core/services';
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
  SignUpWithEmailAndPassword
} from './auth.actions';

@Injectable()
export class AuthEffects {
  private userRef: AngularFirestoreDocument<User>;

  @Effect()
  signUpWithEmailAndPassword: Observable<Action> = this.actions.pipe(
    ofType(AuthActionTypes.SignUpWithEmailAndPassword),
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
  signInWithGoogle: Observable<Action> = this.actions.pipe(
    ofType(AuthActionTypes.SignInWithGoogle),
    switchMap((action: SignInWithGoogle) => {
      return this.authService.signInWithGoogle().pipe(
        map(authState => new SignInWithGoogleSuccess()),
        tap(() => this.router.navigate(['/home'])),
        catchError(err => of(new AuthError(err)))
      );
    })
  );

  @Effect()
  signInWithEmailAndPassword: Observable<Action> = this.actions.pipe(
    ofType(AuthActionTypes.SignInWithEmailAndPassword),
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
  signedIn: Observable<Action> = this.actions.pipe(
    ofType(AuthActionTypes.SignedIn),
    map((action: any) => action.payload),
    tap(user => this.userService.createUserIfNotExists(user))
  );

  @Effect()
  sendPasswordResetEmail: Observable<Action> = this.actions.pipe(
    ofType(AuthActionTypes.SendPasswordResetEmail),
    switchMap((action: SendPasswordResetEmail) => {
      return this.authService.sendPasswordResetEmail(action.payload).pipe(
        map(authState => new SendPasswordResetEmaildSuccess()),
        catchError(err => of(new AuthError(err)))
      );
    })
  );

  @Effect({ dispatch: false })
  sendPasswordResetEmaildSuccess: Observable<Action> = this.actions.pipe(
    ofType(AuthActionTypes.SendPasswordResetEmaildSuccess),
    tap(() => this.router.navigate(['/login']))
  );

  @Effect()
  signOut: Observable<Action> = this.actions.pipe(
    ofType(AuthActionTypes.SignOut),
    switchMap((action: SignOut) => {
      return this.authService.signOut().pipe(map(() => new SignedOut()));
    })
  );

  @Effect({ dispatch: false })
  signedOut: Observable<Action> = this.actions.pipe(
    ofType(AuthActionTypes.SignedOut),
    tap(() => this.router.navigate(['/login']))
  );

  @Effect({ dispatch: false })
  signUpSuccess: Observable<Action> = this.actions.pipe(
    ofType(AuthActionTypes.SignUpSuccess),
    tap(() => this.router.navigate(['/home']))
  );

  constructor(
    private actions: Actions,
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) {}
}
