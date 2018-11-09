import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Authenticate } from '@nbdigi/data-models';
import { Store } from '@ngrx/store';
import * as session from '../../+state/actions/session.actions';
import * as fromRoot from '../../+state/reducers';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nbd-login
      [authError]="authError | async"
      (signInWithGoogleSelected)="signInWithGoogle()"
      (signInWithEmailAndPasswordSelected)="signInWithEmailAndPassword($event)"
    >
    </nbd-login>
  `
})
export class LoginPageComponent {
  authError = this.store.select(fromRoot.getAuthError);

  constructor(private store: Store<fromRoot.State>) {}

  signInWithGoogle(): void {
    this.store.dispatch(new session.SignInWithGoogle());
  }

  signInWithEmailAndPassword(authenticate: Authenticate): void {
    this.store.dispatch(
      new session.SignInWithEmailAndPassword({
        email: authenticate.email,
        password: authenticate.password
      })
    );
  }
}
