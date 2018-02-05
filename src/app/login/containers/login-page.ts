import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromRoot from './../../+state/reducers';
import * as session from './../../+state/actions/session.actions';
import { Authenticate } from './../../models/auth.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-login
      [authError]="authError | async"
      (signInWithGoogleSelected)="signInWithGoogle()"
      (signInWithEmailAndPasswordSelected)="signInWithEmailAndPassword($event)"
      >
    </app-login>
  `
})
export class LoginPageComponent {
  authError = this.store.select(fromRoot.getAuthError);

  constructor(private store: Store<fromRoot.State>) { }

  signInWithGoogle(): void {
    this.store.dispatch(new session.SignInWithGoogle());
  }

  signInWithEmailAndPassword(authenticate: Authenticate): void {
    this.store.dispatch(new session.SignInWithEmailAndPassword({
      email: authenticate.email,
      password: authenticate.password
    }));
  }

}
