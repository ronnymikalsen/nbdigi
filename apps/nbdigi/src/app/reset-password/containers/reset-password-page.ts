import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import * as session from '../../+state/actions/session.actions';
import * as fromRoot from '../../+state/reducers';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nbd-reset-password
      [authError]="authError | async"
      (resetEmail)="resetPassord($event)"
    >
    </nbd-reset-password>
  `
})
export class ResetPasswordPageComponent {
  authError = this.store.select(fromRoot.getAuthError);

  constructor(private store: Store<fromRoot.State>) {}

  resetPassord(email: string) {
    this.store.dispatch(new session.SendPasswordResetEmail(email));
  }
}
