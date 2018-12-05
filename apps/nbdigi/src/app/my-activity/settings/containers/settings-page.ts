import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AppFacade } from '../../../+state/app/app.facade';
import { AuthFacade } from '../../../+state/auth/auth.facade';
import { User } from '../../../core/models';

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
  currentTheme: Observable<string> = this.appFacade.currentTheme$;

  constructor(private authFacade: AuthFacade, private appFacade: AppFacade) {}

  signOut(): void {
    this.authFacade.signOut();
  }

  theme(theme: string) {
    this.appFacade.setTheme(theme);
  }
}
