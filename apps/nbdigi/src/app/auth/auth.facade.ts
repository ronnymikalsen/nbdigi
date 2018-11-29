import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AuthPartialState } from './auth.reducer';
import { authQuery } from './auth.selectors';

@Injectable()
export class AuthFacade {
  currentUser$ = this.store.pipe(select(authQuery.currentUser));
  getError$ = this.store.pipe(select(authQuery.getError));

  constructor(private store: Store<AuthPartialState>) {}
}
