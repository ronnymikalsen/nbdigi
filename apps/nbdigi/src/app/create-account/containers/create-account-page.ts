import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import * as session from '../../+state/actions/session.actions';
import * as fromRoot from '../../+state/reducers';
import { Authenticate } from '../../core/models';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nbd-create-account
      [authError]="authError | async"
      (signUpSelected)="signUp($event)"
    >
    </nbd-create-account>
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
