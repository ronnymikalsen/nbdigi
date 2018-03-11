import { Component, OnInit, OnDestroy, Optional } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { AngularFireAuth } from 'angularfire2/auth';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';

import * as fromRoot from './+state/reducers';
import * as session from './+state/actions/session.actions';
import { CheckForUpdateService } from './core/check-for-update-service/check-for-update.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private destroyed: Subject<void> = new Subject();

  constructor(
    private updates: CheckForUpdateService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private afAuth: AngularFireAuth,
    private store: Store<fromRoot.State>
  ) {
    iconRegistry.addSvgIcon(
      'logo',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/logo.svg')
    );
    iconRegistry.addSvgIcon(
      'google',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/google-logo.svg')
    );
  }

  ngOnInit() {
    this.afAuth.authState.pipe(takeUntil(this.destroyed)).subscribe(
      authState => {
        if (authState) {
          this.store.dispatch(
            new session.SignedIn({
              uid: authState.uid,
              displayName: authState.displayName,
              email: authState.email
            })
          );
        } else {
          this.store.dispatch(new session.SignOut());
        }
      },
      err => console.log('errr', err)
    );
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
