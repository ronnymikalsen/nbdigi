import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromRoot from './../../+state/reducers';
import * as session from './../../+state/actions/session.actions';
import { Authenticate } from './../../models/auth.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-reset-password
      [authError]="authError | async"
      (resetEmail)="resetPassord($event)">
    </app-reset-password>
  `
})
export class ResetPasswordPageComponent {
  authError = this.store.select(fromRoot.getAuthError);

  constructor(private store: Store<fromRoot.State>) {}

  resetPassord(email: string) {
    this.store.dispatch(new session.SendPasswordResetEmail(email));
  }
}
