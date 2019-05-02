import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';

import { MyActivityPartialState } from './my-activity.reducer';
import {
  LoadMyActivity,
  MyActivityLoaded,
  MyActivityLoadError,
  MyActivityActionTypes
} from './my-activity.actions';

@Injectable()
export class MyActivityEffects {
  @Effect() loadMyActivity$ = this.dataPersistence.fetch(
    MyActivityActionTypes.LoadMyActivity,
    {
      run: (action: LoadMyActivity, state: MyActivityPartialState) => {
        // Your custom REST 'load' logic goes here. For now just return an empty list...
        return new MyActivityLoaded([]);
      },

      onError: (action: LoadMyActivity, error) => {
        console.error('Error', error);
        return new MyActivityLoadError(error);
      }
    }
  );

  constructor(
    private actions$: Actions,
    private dataPersistence: DataPersistence<MyActivityPartialState>
  ) {}
}
