import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, SessionService } from '@nbdigi/backend';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import {
  AuthError,
  SendPasswordResetEmail,
  SendPasswordResetEmaildSuccess,
  SessionActionTypes,
  SignedOut,
  SignInWithEmailAndPassword,
  SignInWithEmailAndPasswordSuccess,
  SignInWithGoogle,
  SignInWithGoogleSuccess,
  SignOut,
  SignUpSuccess,
  SignUpWithEmailAndPassword
} from './session.actions';

@Injectable()
export class SessionEffects {
  @Effect()
  signUpWithEmailAndPassword: Observable<Action> = this.actions.pipe(
    ofType(SessionActionTypes.SignUpWithEmailAndPassword),
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
    ofType(SessionActionTypes.SignInWithGoogle),
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
    ofType(SessionActionTypes.SignInWithEmailAndPassword),
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
    ofType(SessionActionTypes.SignedIn),
    map((action: any) => action.payload),
    tap(user => this.sessionService.createUserIfNotExists(user))
  );

  @Effect()
  sendPasswordResetEmail: Observable<Action> = this.actions.pipe(
    ofType(SessionActionTypes.SendPasswordResetEmail),
    switchMap((action: SendPasswordResetEmail) => {
      return this.authService.sendPasswordResetEmail(action.payload).pipe(
        map(authState => new SendPasswordResetEmaildSuccess()),
        catchError(err => of(new AuthError(err)))
      );
    })
  );

  @Effect({ dispatch: false })
  sendPasswordResetEmaildSuccess: Observable<Action> = this.actions.pipe(
    ofType(SessionActionTypes.SendPasswordResetEmaildSuccess),
    tap(() => this.router.navigate(['/login']))
  );

  @Effect()
  signOut: Observable<Action> = this.actions.pipe(
    ofType(SessionActionTypes.SignOut),
    switchMap((action: SignOut) => {
      return this.authService.signOut().pipe(map(() => new SignedOut()));
    })
  );

  @Effect({ dispatch: false })
  signedOut: Observable<Action> = this.actions.pipe(
    ofType(SessionActionTypes.SignedOut),
    tap(() => this.router.navigate(['/login']))
  );

  @Effect({ dispatch: false })
  debugOn: Observable<Action> = this.actions.pipe(
    ofType(SessionActionTypes.DebugOn),
    tap(() => this.sessionService.updateDebugOn(true))
  );

  @Effect({ dispatch: false })
  debugOff: Observable<Action> = this.actions.pipe(
    ofType(SessionActionTypes.DebugOff),
    tap(() => this.sessionService.updateDebugOn(false))
  );

  @Effect({ dispatch: false })
  theme: Observable<Action> = this.actions.pipe(
    ofType(SessionActionTypes.SetTheme),
    map((action: any) => action.payload),
    tap(theme => {
      localStorage.setItem('currentTheme', theme);
      this.sessionService.updateTheme(theme);
    })
  );

  @Effect({ dispatch: false })
  signUpSuccess: Observable<Action> = this.actions.pipe(
    ofType(SessionActionTypes.SignUpSuccess),
    tap(() => this.router.navigate(['/home']))
  );

  @Effect({ dispatch: false })
  showDateGraph: Observable<Action> = this.actions.pipe(
    ofType(SessionActionTypes.ShowDateGraph),
    map((action: any) => action.payload),
    tap(() => {
      localStorage.setItem('showDateGraph', '' + true);
    })
  );

  @Effect({ dispatch: false })
  hideDateGraph: Observable<Action> = this.actions.pipe(
    ofType(SessionActionTypes.HideDateGraph),
    map((action: any) => action.payload),
    tap(() => {
      localStorage.setItem('showDateGraph', '' + false);
    })
  );

  constructor(
    private actions: Actions,
    private router: Router,
    private authService: AuthService,
    private sessionService: SessionService
  ) {}
}
