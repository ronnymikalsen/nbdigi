import { Injectable } from '@angular/core';

import { select, Store } from '@ngrx/store';

import { AuthenticationstatePartialState } from './authenticationstate.reducer';
import { authenticationstateQuery } from './authenticationstate.selectors';
import { LoadAuthenticationstate } from './authenticationstate.actions';

@Injectable()
export class AuthenticationstateFacade {
  loaded$ = this.store.pipe(select(authenticationstateQuery.getLoaded));
  allAuthenticationstate$ = this.store.pipe(
    select(authenticationstateQuery.getAllAuthenticationstate)
  );
  selectedAuthenticationstate$ = this.store.pipe(
    select(authenticationstateQuery.getSelectedAuthenticationstate)
  );

  constructor(private store: Store<AuthenticationstatePartialState>) {}

  loadAll() {
    this.store.dispatch(new LoadAuthenticationstate());
  }
}
