import {
  CollectionReference,
  Firestore,
  collection,
  getDoc,
  serverTimestamp,
  updateDoc,
  DocumentReference,
  doc,
} from '@angular/fire/firestore';
import { filter } from 'rxjs/operators';
import { AppFacade } from '../../+state/app/app.facade';
import { AuthFacade } from '../../+state/auth/auth.facade';
import { Item, User } from '../../core/models';
import { UserService } from './user.service';
import { Injectable, NgZone } from '@angular/core';

@Injectable()
export class SessionService {
  private userRef: DocumentReference<User> | undefined;
  private currentTheme: string = 'light';
  private debugon: boolean = false;

  constructor(
    private ngZone: NgZone,
    //private afAuth: AngularFireAuth,
    private afs: Firestore,
    private userService: UserService,
    private authFacade: AuthFacade,
    private appFacade: AppFacade,
  ) {}

  init() {
    this.appFacade.currentTheme$.subscribe((theme) => {
      this.currentTheme = theme;
    });

    this.appFacade.isDebugOn$.subscribe((debugon) => {
      this.debugon = debugon;
    });

    this.ngZone.runOutsideAngular(() => {
      /*
      this.afAuth.authState.pipe().subscribe(
        (authState: any) => {
          if (authState) {
            const user = {
              uid: authState.uid,
              displayName: authState.displayName,
              email: authState.email,
            };
            this.userService.createUserIfNotExists(user);
            this.userRef = doc<User>(this.afs, `users/${authState.uid}`);
            this.userRef
              .valueChanges()
              .pipe(filter((u) => u !== null))
              .subscribe((u: User) => {
                this.authFacade.signedIn({
                  ...user,
                });
                if (u.theme && u.theme !== this.currentTheme) {
                  this.appFacade.setTheme(u.theme);
                }
                if (u.isDebugOn !== this.debugon) {
                  u.isDebugOn
                    ? this.appFacade.debugOn()
                    : this.appFacade.debugOff();
                }
              });
          } else {
            this.authFacade.signOut();
          }
        },
        (err: Error) => console.log('errr', err)
      );
      */
    });
    const showDateGraph: boolean = Boolean(
      localStorage.getItem('showDateGraph'),
    );
    showDateGraph
      ? this.appFacade.showDateGraph()
      : this.appFacade.hideDateGraph();
  }

  updateTheme(theme: string) {
    if (theme) {
      /*
      this.userRef.update({
        theme: theme,
      });
      */
    }
  }

  updateItem(item: Item) {
    /*
    this.userRef
      .collection('items')
      .doc(item.id)
      .set({
        ...item,
        timestamp: serverTimestamp(),
      });
      */
  }
}
