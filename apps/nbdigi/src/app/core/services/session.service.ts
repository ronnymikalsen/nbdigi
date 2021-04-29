import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { filter } from 'rxjs/operators';
import { AppFacade } from '../../+state/app/app.facade';
import { AuthFacade } from '../../+state/auth/auth.facade';
import { Item, User } from '../../core/models';
import { UserService } from './user.service';

@Injectable()
export class SessionService {
  private userRef: AngularFirestoreDocument<User>;
  constructor(
    private ngZone: NgZone,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private userService: UserService,
    private authFacade: AuthFacade,
    private appFacade: AppFacade
  ) {}

  init() {
    this.ngZone.runOutsideAngular(() => {
      this.afAuth.authState.pipe().subscribe(
        (authState) => {
          if (authState) {
            console.log(authState);
            
            const user = {
              uid: authState.uid,
              displayName: authState.displayName,
              email: authState.email,
            };
            this.userService.createUserIfNotExists(user);
            this.userRef = this.afs.doc<User>(`users/${authState.uid}`);
            this.userRef
              .valueChanges()
              .pipe(filter((u) => u !== null))
              .subscribe((u) => {
                this.authFacade.signedIn({
                  ...user,
                });
                console.log(u);
                /*
                this.appFacade.setTheme(u.theme);
                u.isDebugOn
                  ? this.appFacade.debugOn()
                  : this.appFacade.debugOff();
                  */
              });
          } else {
            this.authFacade.signOut();
          }
        },
        (err) => console.log('errr', err)
      );
    });
    const showDateGraph: boolean = Boolean(
      localStorage.getItem('showDateGraph')
    );
    showDateGraph
      ? this.appFacade.showDateGraph()
      : this.appFacade.hideDateGraph();
  }

  updateTheme(theme: string) {
    if (theme) {
      console.log(theme);
      
      this.userRef.update({
        theme: theme,
      });
    }
  }

  updateItem(item: Item) {
    this.userRef
      .collection('items')
      .doc(item.id)
      .set({
        ...item,
        timestamp: firebase.firestore.Timestamp.now(),
      });
  }
}
