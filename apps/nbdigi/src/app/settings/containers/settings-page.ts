import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthFacade } from '../../+state/auth/auth.facade';
import { SessionFacade } from '../../+state/session/session.facade';
import { User } from '../../core/models';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nbd-settings
      [user]="currentUser | async"
      [currentTheme]="currentTheme | async"
      (signOut)="signOut()"
      (themeChange)="theme($event)"
    >
    </nbd-settings>
  `
})
export class SettingsPageComponent {
  currentUser: Observable<User> = this.authFacade.currentUser$;
  currentTheme: Observable<string> = this.sessionFacade.currentTheme$;

  constructor(
    private authFacade: AuthFacade,
    private sessionFacade: SessionFacade
  ) {}

  signOut(): void {
    this.authFacade.signOut();
  }

  theme(theme: string) {
    this.sessionFacade.setTheme(theme);
  }
}
