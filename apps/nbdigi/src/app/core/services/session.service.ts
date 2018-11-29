import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import * as firebase from 'firebase/app';
import { filter } from 'rxjs/operators';
import * as session from '../../+state/actions/session.actions';
import { AuthFacade } from '../../+state/auth/auth.facade';
import * as fromRoot from '../../+state/reducers';
import { Item, User } from '../../core/models';
import { UserService } from './user.service';

@Injectable()
export class SessionService {
  private userRef: AngularFirestoreDocument<User>;
  constructor(
    private ngZone: NgZone,
    private afAuth: AngularFireAuth,
    private store: Store<fromRoot.State>,
    private afs: AngularFirestore,
    private userService: UserService,
    private authFacade: AuthFacade
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
            this.userService.createUserIfNotExists(user);
            this.userRef
              .valueChanges()
              .pipe(filter(u => u !== null))
              .subscribe(u => {
                this.authFacade.SignedIn({
                  ...user,
                  isDebugOn: u.isDebugOn,
                  theme: u.theme
                });
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

  updateItem(item: Item) {
    this.userRef
      .collection('items')
      .doc(item.id)
      .set({
        ...item,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
  }
}
