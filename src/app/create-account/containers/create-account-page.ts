import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromRoot from './../../+state/reducers';
import * as session from './../../+state/actions/session.actions';
import { Authenticate } from './../../models/auth.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-create-account
      [authError]="authError | async"
      (signUpSelected)="signUp($event)">
    </app-create-account>
  `
})
export class CreateAccountPageComponent {
  authError = this.store.select(fromRoot.getAuthError);

  constructor(private store: Store<fromRoot.State>) {}

  signInWithGoogle(): void {
    this.store.dispatch(new session.SignInWithGoogle());
  }

  signUp(authenticate: Authenticate): void {
    this.store.dispatch(
      new session.SignUpWithEmailAndPassword({
        email: authenticate.email,
        password: authenticate.password
      })
    );
  }
}
