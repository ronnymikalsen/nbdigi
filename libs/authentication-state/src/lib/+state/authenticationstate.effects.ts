import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';

import { AuthenticationstatePartialState } from './authenticationstate.reducer';
import {
  LoadAuthenticationstate,
  AuthenticationstateLoaded,
  AuthenticationstateLoadError,
  AuthenticationstateActionTypes
} from './authenticationstate.actions';

@Injectable()
export class AuthenticationstateEffects {
  @Effect()
  loadAuthenticationstate$ = this.dataPersistence.fetch(
    AuthenticationstateActionTypes.LoadAuthenticationstate,
    {
      run: (
        action: LoadAuthenticationstate,
        state: AuthenticationstatePartialState
      ) => {
        // Your custom REST 'load' logic goes here. For now just return an empty list...
        return new AuthenticationstateLoaded([]);
      },

      onError: (action: LoadAuthenticationstate, error) => {
        console.error('Error', error);
        return new AuthenticationstateLoadError(error);
      }
    }
  );

  constructor(
    private actions$: Actions,
    private dataPersistence: DataPersistence<AuthenticationstatePartialState>
  ) {}
}
