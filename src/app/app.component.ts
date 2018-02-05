import { Component, OnInit, OnDestroy, Optional } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { DomSanitizer } from '@angular/platform-browser';
import { MatSnackBar, MatIconRegistry } from '@angular/material';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { AngularFireAuth } from 'angularfire2/auth';

import * as fromRoot from './+state/reducers';
import * as session from './+state/actions/session.actions';
import { catchError, tap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private destroyed: Subject<void> = new Subject();

  constructor(
    @Optional() private swUpdate: SwUpdate,
    private snackBar: MatSnackBar,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private afAuth: AngularFireAuth,
    private store: Store<fromRoot.State>
  ) {
    iconRegistry.addSvgIcon('logo', sanitizer.bypassSecurityTrustResourceUrl('assets/images/logo.svg'));
    iconRegistry.addSvgIcon('google', sanitizer.bypassSecurityTrustResourceUrl('assets/images/google-logo.svg'));
  }

  ngOnInit() {
    if (this.swUpdate) {
      this.swUpdate.available.pipe(takeUntil(this.destroyed)).subscribe(event => {
        const snackBarRef = this.snackBar.open('En ny oppdatering av NBDigi er tilgjengelig', 'Oppdater nå');
        snackBarRef.onAction().subscribe(() => {
          this.swUpdate.activateUpdate().then(() => document.location.reload());
        });
      });
    }

    this.afAuth.authState.pipe(
    ).subscribe((authState) => {
      if (authState) {
        this.store.dispatch(new session.SignedIn({
          displayName: authState.displayName,
          email: authState.email
        }));
      } else {
        this.store.dispatch(new session.SignOut());
      }
    }, (err) => console.log('errr', err));
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
