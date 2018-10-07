import { Injectable, NgZone } from '@angular/core';
import { Store } from '@ngrx/store';
import { AngularFireAuth } from 'angularfire2/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from 'angularfire2/firestore';
import { filter } from 'rxjs/operators';
import * as session from '../../+state/actions/session.actions';
import * as fromRoot from '../../+state/reducers';
import { User } from '../../models/user.model';

@Injectable()
export class SessionService {
  private userRef: AngularFirestoreDocument<User>;

  constructor(
    private ngZone: NgZone,
    private afAuth: AngularFireAuth,
    private store: Store<fromRoot.State>,
    private afs: AngularFirestore
  ) {}

  init() {
    this.ngZone.runOutsideAngular(() => {
      this.afAuth.authState.pipe().subscribe(
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
              .pipe(filter(u => u !== null))
              .subscribe(u => {
                this.store.dispatch(
                  new session.SignedIn({
                    ...user,
                    isDebugOn: u.isDebugOn,
                    theme: u.theme
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
    const showDateGraph: boolean = Boolean(
      localStorage.getItem('showDateGraph')
    );
    showDateGraph
      ? this.store.dispatch(new session.ShowDateGraph())
      : this.store.dispatch(new session.HideDateGraph());
  }

  updateTheme(theme: string) {
    this.userRef.update({
      theme: theme
    });
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
