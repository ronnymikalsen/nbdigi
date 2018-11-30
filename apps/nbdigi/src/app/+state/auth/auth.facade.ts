import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Authenticate, User } from '../../core/models';
import {
  SendPasswordResetEmail,
  SignedIn,
  SignInWithEmailAndPassword,
  SignInWithGoogle,
  SignOut,
  SignUpWithEmailAndPassword
} from './auth.actions';
import { AuthPartialState } from './auth.reducer';
import { authQuery } from './auth.selectors';

@Injectable()
export class AuthFacade {
  currentUser$ = this.store.pipe(select(authQuery.currentUser));
  getError$ = this.store.pipe(select(authQuery.getError));

  constructor(private store: Store<AuthPartialState>) {}

  sendPasswordResetEmail(email: string): any {
    this.store.dispatch(new SendPasswordResetEmail(email));
  }

  signInWithGoogle(): any {
    this.store.dispatch(new SignInWithGoogle());
  }

  signInWithEmailAndPassword(authenticate: Authenticate): any {
    this.store.dispatch(
      new SignInWithEmailAndPassword({
        email: authenticate.email,
        password: authenticate.password
      })
    );
  }

  signUpWithEmailAndPassword(authenticate: Authenticate): any {
    this.store.dispatch(
      new SignUpWithEmailAndPassword({
        email: authenticate.email,
        password: authenticate.password
      })
    );
  }
  signedIn(user: User): any {
    this.store.dispatch(new SignedIn(user));
  }

  signOut(): any {
    this.store.dispatch(new SignOut());
  }
}
