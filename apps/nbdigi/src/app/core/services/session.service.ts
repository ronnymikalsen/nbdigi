import { Injectable } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import {
  DocumentReference,
  Firestore,
  collection,
  doc,
  docData,
  serverTimestamp,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AppFacade } from '../../+state/app/app.facade';
import { AuthFacade } from '../../+state/auth/auth.facade';
import { Item, User } from '../../core/models';
import { UserService } from './user.service';

@Injectable()
export class SessionService {
  private userRef: DocumentReference<User> | undefined;
  private currentTheme = 'dark-theme';
  private debugon = false;
  private hadAuthenticatedUser = false;

  constructor(
    private auth: Auth,
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

    authState(this.auth)
      .pipe(
        switchMap((firebaseUser) => {
          if (!firebaseUser) {
            this.userRef = undefined;
            if (this.hadAuthenticatedUser) {
              this.authFacade.signedOut();
            }
            this.hadAuthenticatedUser = false;
            return of(undefined);
          }

          this.hadAuthenticatedUser = true;

          const user: User = { uid: firebaseUser.uid };
          if (firebaseUser.displayName) {
            user.displayName = firebaseUser.displayName;
          }
          if (firebaseUser.email) {
            user.email = firebaseUser.email;
          }

          this.authFacade.signedIn(user);
          this.userService.createUserIfNotExists(user);
          this.userRef = doc(
            this.afs,
            `users/${firebaseUser.uid}`,
          ) as DocumentReference<User>;

          return docData(this.userRef).pipe(
            catchError((error) => {
              console.error('Could not load user settings', error);
              return of(undefined);
            }),
          );
        }),
      )
      .subscribe((userSettings) => {
        if (!userSettings) {
          return;
        }

        if (userSettings.theme) {
          const theme =
            userSettings.theme === 'dark-theme'
              ? 'dark-theme'
              : 'light-theme';
          if (theme !== this.currentTheme) {
            this.appFacade.setTheme(theme);
          }
        }
        if (userSettings.isDebugOn !== this.debugon) {
          if (userSettings.isDebugOn) {
            this.appFacade.debugOn();
          } else {
            this.appFacade.debugOff();
          }
        }
      });
    const showDateGraph = Boolean(localStorage.getItem('showDateGraph'));
    if (showDateGraph) {
      this.appFacade.showDateGraph();
    } else {
      this.appFacade.hideDateGraph();
    }
  }

  updateTheme(theme: string) {
    if (theme && this.userRef) {
      void updateDoc(this.userRef, { theme });
    }
  }

  updateItem(item: Item) {
    if (this.userRef && item.id) {
      const itemRef = doc(collection(this.userRef, 'items'), item.id);
      void setDoc(itemRef, {
        ...item,
        timestamp: serverTimestamp(),
      });
    }
  }
}
