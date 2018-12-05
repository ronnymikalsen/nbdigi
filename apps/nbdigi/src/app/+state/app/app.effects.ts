import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { User } from '../../core/models';
import { SessionService } from '../../core/services/session.service';
import { AuthFacade } from '../auth/auth.facade';
import { AppActionTypes } from './app.actions';

@Injectable()
export class AppEffects {
  private userRef: AngularFirestoreDocument<User>;

  @Effect({ dispatch: false })
  debugOn: Observable<Action> = this.actions.pipe(
    ofType(AppActionTypes.DebugOn),
    tap(() =>
      this.userRef.update({
        isDebugOn: true
      })
    )
  );

  @Effect({ dispatch: false })
  debugOff: Observable<Action> = this.actions.pipe(
    ofType(AppActionTypes.DebugOff),
    tap(() =>
      this.userRef.update({
        isDebugOn: false
      })
    )
  );

  @Effect({ dispatch: false })
  theme: Observable<Action> = this.actions.pipe(
    ofType(AppActionTypes.SetTheme),
    map((action: any) => action.payload),
    tap(theme => {
      localStorage.setItem('currentTheme', theme);
      this.sessionService.updateTheme(theme);
    })
  );

  @Effect({ dispatch: false })
  showDateGraph: Observable<Action> = this.actions.pipe(
    ofType(AppActionTypes.ShowDateGraph),
    map((action: any) => action.payload),
    tap(() => {
      localStorage.setItem('showDateGraph', '' + true);
    })
  );

  @Effect({ dispatch: false })
  hideDateGraph: Observable<Action> = this.actions.pipe(
    ofType(AppActionTypes.HideDateGraph),
    map((action: any) => action.payload),
    tap(() => {
      localStorage.setItem('showDateGraph', '' + false);
    })
  );

  constructor(
    private actions: Actions,
    private sessionService: SessionService,
    private afs: AngularFirestore,
    private authFacade: AuthFacade
  ) {
    this.authFacade.currentUser$
      .pipe(filter(user => user !== null))
      .subscribe((user: User) => {
        this.userRef = afs.doc<User>(`users/${user.uid}`);
      });
  }
}
