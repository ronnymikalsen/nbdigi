import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthFacade } from '../../+state/auth/auth.facade';
import { Authenticate } from '../../core/models';

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
  authError = this.authFacade.getError$;

  constructor(private authFacade: AuthFacade) {}

  signInWithGoogle(): void {
    this.authFacade.signInWithGoogle();
  }

  signInWithEmailAndPassword(authenticate: Authenticate): void {
    this.authFacade.signInWithEmailAndPassword(authenticate);
  }
}
