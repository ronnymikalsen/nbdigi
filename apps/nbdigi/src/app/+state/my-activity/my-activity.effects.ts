import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, switchMap } from 'rxjs';

import { MyActivityActionTypes, MyActivityLoaded } from './my-activity.actions';

@Injectable()
export class MyActivityEffects {
  loadMyActivity$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(MyActivityActionTypes.LoadMyActivity),
      // Your custom REST 'load' logic goes here. For now just return an empty list.
      switchMap(() => of(new MyActivityLoaded([]))),
    ),
  );

  constructor(private actions$: Actions) {}
}
