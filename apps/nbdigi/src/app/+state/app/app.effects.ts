import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { SessionService } from '../../core/services/session.service';
import { UserService } from '../../core/services/user.service';
import { AppActionTypes } from './app.actions';

@Injectable()
export class AppEffects {
  debugOn: Observable<Action> = createEffect(
    () =>
      this.actions.pipe(
        ofType(AppActionTypes.DebugOn),
        tap(() => {
          this.userService.updateUser({
            isDebugOn: true,
          });
        }),
      ),
    { dispatch: false },
  );

  debugOff: Observable<Action> = createEffect(
    () =>
      this.actions.pipe(
        ofType(AppActionTypes.DebugOff),
        tap(() => {
          this.userService.updateUser({
            isDebugOn: false,
          });
        }),
      ),
    { dispatch: false },
  );

  theme: Observable<Action> = createEffect(
    () =>
      this.actions.pipe(
        ofType(AppActionTypes.SetTheme),
        map((action: any) => action.payload),
        tap((theme) => {
          localStorage.setItem('currentTheme', theme);
          this.sessionService.updateTheme(theme);
        }),
      ),
    { dispatch: false },
  );

  showDateGraph: Observable<Action> = createEffect(
    () =>
      this.actions.pipe(
        ofType(AppActionTypes.ShowDateGraph),
        map((action: any) => action.payload),
        tap(() => {
          localStorage.setItem('showDateGraph', '' + true);
        }),
      ),
    { dispatch: false },
  );

  hideDateGraph: Observable<Action> = createEffect(
    () =>
      this.actions.pipe(
        ofType(AppActionTypes.HideDateGraph),
        map((action: any) => action.payload),
        tap(() => {
          localStorage.setItem('showDateGraph', '' + false);
        }),
      ),
    { dispatch: false },
  );

  constructor(
    private actions: Actions,
    private sessionService: SessionService,
    private userService: UserService,
  ) {}
}
