import { isDebugOn } from './+state/reducers/index';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from 'angularfire2/firestore';
import { Component, OnInit, OnDestroy, Optional, NgZone } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { AngularFireAuth } from 'angularfire2/auth';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs/Subject';
import { takeUntil, take, filter } from 'rxjs/operators';

import * as fromRoot from './+state/reducers';
import * as session from './+state/actions/session.actions';
import { CheckForUpdateService } from './core/check-for-update-service/check-for-update.service';
import { User } from './models/user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private destroyed: Subject<void> = new Subject();
  private userRef: AngularFirestoreDocument<User>;
  private user: User;

  constructor(
    private ngZone: NgZone,
    private updates: CheckForUpdateService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
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
    this.updates.init();

    this.ngZone.runOutsideAngular(() => {
      this.afAuth.authState.pipe(takeUntil(this.destroyed)).subscribe(
        authState => {
          if (authState) {
            this.userRef = this.afs.doc<User>(`users/${authState.uid}`);
            const user = {
              uid: authState.uid,
              displayName: authState.displayName,
              email: authState.email
            };
            this.createUserIfNotExists(user);
            this.userRef
              .valueChanges()
              .pipe(filter(u => u !== null), takeUntil(this.destroyed))
              .subscribe(u => {
                this.store.dispatch(
                  new session.SignedIn({
                    ...user,
                    isDebugOn: u.isDebugOn
                  })
                );
              });
          } else {
            this.store.dispatch(new session.SignOut());
          }
        },
        err => console.log('errr', err)
      );
    });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  private createUserIfNotExists(user: User) {
    return this.userRef.ref.get().then(u => {
      if (!u.exists) {
        this.userRef.set(user);
        return user;
      }
    });
  }
}
