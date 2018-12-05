import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthFacade } from '../../../+state/auth/auth.facade';

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
  authError = this.authFacade.getError$;

  constructor(private authFacade: AuthFacade) {}

  resetPassord(email: string) {
    this.authFacade.sendPasswordResetEmail(email);
  }
}
