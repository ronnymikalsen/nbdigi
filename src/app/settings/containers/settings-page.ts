import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromRoot from './../../+state/reducers';
import * as fromSession from './../../+state/reducers/session.reducer';
import * as sessionAction from './../../+state/actions/session.actions';
import * as session from './../../+state/actions/session.actions';
import { Hint } from './../../core/typeahead-service/hints.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-settings
      [session]="session | async"
      (signOut)="signOut()"
      (themeChange)="theme($event)">
    </app-settings>
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
