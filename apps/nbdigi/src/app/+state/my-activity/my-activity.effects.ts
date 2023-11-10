import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { fetch } from '@nrwl/angular';
import {
  LoadMyActivity,
  MyActivityActionTypes,
  MyActivityLoadError,
  MyActivityLoaded,
} from './my-activity.actions';
import { MyActivityPartialState } from './my-activity.reducer';

@Injectable()
export class MyActivityEffects {
  loadMyActivity$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(MyActivityActionTypes.LoadMyActivity),
      fetch({
        run: (action: LoadMyActivity, state: MyActivityPartialState) => {
          // Your custom REST 'load' logic goes here. For now just return an empty list...
          return new MyActivityLoaded([]);
        },

        onError: (action: LoadMyActivity, error) => {
          console.error('Error', error);
          return new MyActivityLoadError(error);
        },
      }),
    ),
  );

  constructor(private actions$: Actions) {}
}
