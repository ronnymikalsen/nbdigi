import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as sessionAction from '../../+state/actions/session.actions';
import { AuthFacade } from '../../+state/auth/auth.facade';
import * as fromRoot from '../../+state/reducers';
import { User } from '../../core/models';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nbd-settings
      [user]="currentUser | async"
      (signOut)="signOut()"
      (themeChange)="theme($event)"
    >
    </nbd-settings>
  `
})
export class SettingsPageComponent {
  currentUser: Observable<User> = this.authFacade.currentUser$;

  constructor(
    private store: Store<fromRoot.State>,
    private authFacade: AuthFacade
  ) {}

  signOut(): void {
    this.authFacade.signOut();
  }

  theme(theme: string) {
    this.store.dispatch(new sessionAction.SetTheme(theme));
  }
}
