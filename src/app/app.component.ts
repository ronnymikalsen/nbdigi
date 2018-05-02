import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { filter, map } from 'rxjs/operators';

import { CheckForUpdateService } from './core/check-for-update-service/check-for-update.service';
import { SessionService } from './core/session-service/session.service';
import { User } from './models/user.model';
import * as fromRoot from './+state/reducers';
import * as fromSession from './+state/reducers/session.reducer';
import * as sessionAction from './+state/actions/session.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  currentTheme: string;
  private user: User;

  constructor(
    private updates: CheckForUpdateService,
    private sessionService: SessionService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private store: Store<fromRoot.State>,
    private overlayContainer: OverlayContainer
  ) {
    iconRegistry.addSvgIcon(
      'logo',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/logo.svg')
    );
    iconRegistry.addSvgIcon(
      'google',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/google-logo.svg')
    );

    this.currentTheme = localStorage.getItem('currentTheme');
  }

  ngOnInit() {
    this.updates.init();
    this.sessionService.init();

    this.store
      .select(fromRoot.currentTheme)
      .pipe(map(t => (t !== null ? t : 'default-theme')))
      .subscribe(t => {
        const previousTheme = this.currentTheme;
        this.currentTheme = t;
        localStorage.setItem('currentTheme', t);
        this.overlayContainer
          .getContainerElement()
          .classList.remove(previousTheme);
        this.overlayContainer
          .getContainerElement()
          .classList.add(this.currentTheme);
      });
  }
}
