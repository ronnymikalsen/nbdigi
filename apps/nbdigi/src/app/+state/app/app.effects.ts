import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { SessionService } from '../../core/services/session.service';
import { UserService } from '../../core/services/user.service';
import { AppActionTypes } from './app.actions';

@Injectable()
export class AppEffects {
  @Effect({ dispatch: false })
  debugOn: Observable<Action> = this.actions.pipe(
    ofType(AppActionTypes.DebugOn),
    tap(() => {
      this.userService.updateUser({
        isDebugOn: true,
      });
    })
  );

  @Effect({ dispatch: false })
  debugOff: Observable<Action> = this.actions.pipe(
    ofType(AppActionTypes.DebugOff),
    tap(() => {
      this.userService.updateUser({
        isDebugOn: false,
      });
    })
  );

  @Effect({ dispatch: false })
  theme: Observable<Action> = this.actions.pipe(
    ofType(AppActionTypes.SetTheme),
    map((action: any) => action.payload),
    tap((theme) => {
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
    private userService: UserService
  ) {}
}
