import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { User } from '@nbdigi/data-models';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { AuthService } from '../../core/auth-service/auth.service';
import { SessionService } from '../../core/session-service/session.service';
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
} from '../actions/session.actions';
import * as fromRoot from '../reducers';

@Injectable()
export class SessionEffects {
  private userRef: AngularFirestoreDocument<User>;
  private user: User;

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
    tap(user => this.createUserIfNotExists(user))
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
  debugOn: Observable<Action> = this.actions.pipe(
    ofType(AuthActionTypes.DebugOn),
    tap(() =>
      this.userRef.update({
        isDebugOn: true
      })
    )
  );

  @Effect({ dispatch: false })
  debugOff: Observable<Action> = this.actions.pipe(
    ofType(AuthActionTypes.DebugOff),
    tap(() =>
      this.userRef.update({
        isDebugOn: false
      })
    )
  );

  @Effect({ dispatch: false })
  theme: Observable<Action> = this.actions.pipe(
    ofType(AuthActionTypes.SetTheme),
    map((action: any) => action.payload),
    tap(theme => {
      localStorage.setItem('currentTheme', theme);
      this.sessionService.updateTheme(theme);
    })
  );

  @Effect({ dispatch: false })
  signUpSuccess: Observable<Action> = this.actions.pipe(
    ofType(AuthActionTypes.SignUpSuccess),
    tap(() => this.router.navigate(['/home']))
  );

  @Effect({ dispatch: false })
  showDateGraph: Observable<Action> = this.actions.pipe(
    ofType(AuthActionTypes.ShowDateGraph),
    map((action: any) => action.payload),
    tap(() => {
      localStorage.setItem('showDateGraph', '' + true);
    })
  );

  @Effect({ dispatch: false })
  hideDateGraph: Observable<Action> = this.actions.pipe(
    ofType(AuthActionTypes.HideDateGraph),
    map((action: any) => action.payload),
    tap(() => {
      localStorage.setItem('showDateGraph', '' + false);
    })
  );

  constructor(
    private actions: Actions,
    private router: Router,
    private authService: AuthService,
    private sessionService: SessionService,
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
