import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthFacade } from '../../../+state/auth/auth.facade';
import { Authenticate } from '../../../core/models';

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
  authError = this.authFacade.getError$;

  constructor(private authFacade: AuthFacade) {}

  signInWithGoogle(): void {
    this.authFacade.signInWithGoogle();
  }

  signUp(authenticate: Authenticate): void {
    this.authFacade.signUpWithEmailAndPassword(authenticate);
  }
}
