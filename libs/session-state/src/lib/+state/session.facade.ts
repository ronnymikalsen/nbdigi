import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { SessionPartialState } from './session.reducer';
import { sessionQuery } from './session.selectors';

@Injectable()
export class SessionFacade {
  currentUser$ = this.store.pipe(select(sessionQuery.currentUser));
  getError$ = this.store.pipe(select(sessionQuery.getError));
  isDebugOn$ = this.store.pipe(select(sessionQuery.isDebugOn));
  getTheme$ = this.store.pipe(select(sessionQuery.getTheme));
  showDateGraph$ = this.store.pipe(select(sessionQuery.showDateGraph));

  constructor(private store: Store<SessionPartialState>) {}
}
