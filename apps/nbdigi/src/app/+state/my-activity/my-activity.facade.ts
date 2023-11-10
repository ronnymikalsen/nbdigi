import { Injectable } from '@angular/core';

import { select, Store } from '@ngrx/store';

import { MyActivityPartialState } from './my-activity.reducer';
import { myActivityQuery } from './my-activity.selectors';
import { LoadMyActivity } from './my-activity.actions';

@Injectable()
export class MyActivityFacade {
  loaded$ = this.store.pipe(select(myActivityQuery.getLoaded));
  allMyActivity$ = this.store.pipe(select(myActivityQuery.getAllMyActivity));
  selectedMyActivity$ = this.store.pipe(
    select(myActivityQuery.getSelectedMyActivity),
  );

  constructor(private store: Store<MyActivityPartialState>) {}

  loadAll() {
    this.store.dispatch(new LoadMyActivity());
  }
}
