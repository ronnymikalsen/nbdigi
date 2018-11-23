import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromRoot from '../../+state/reducers';
import * as fromSession from '../../+state/reducers/session.reducer';
import * as sessionAction from '../../+state/actions/session.actions';
import * as session from '../../+state/actions/session.actions';
import { Hint } from '../../core/models/hints.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nbd-settings
      [session]="session | async"
      (signOut)="signOut()"
      (themeChange)="theme($event)"
    >
    </nbd-settings>
  `
})
export class SettingsPageComponent {
  session: Observable<fromSession.State> = this.store.select(
    fromRoot.getSessionState
  );

  constructor(private store: Store<fromRoot.State>) {}

  signOut(): void {
    this.store.dispatch(new session.SignOut());
  }

  theme(theme: string) {
    this.store.dispatch(new sessionAction.SetTheme(theme));
  }
}
