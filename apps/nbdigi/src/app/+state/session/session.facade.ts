import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import {
  DebugOff,
  DebugOn,
  HideDateGraph,
  SetTheme,
  ShowDateGraph
} from './session.actions';
import { SessionPartialState } from './session.reducer';
import { sessionQuery } from './session.selectors';

@Injectable()
export class SessionFacade {
  isDebugOn$ = this.store.pipe(select(sessionQuery.isDebugOn));
  showDateGraph$ = this.store.pipe(select(sessionQuery.showDateGraph));
  currentTheme$ = this.store.pipe(select(sessionQuery.getTheme));

  constructor(private store: Store<SessionPartialState>) {}

  showDateGraph() {
    this.store.dispatch(new ShowDateGraph());
  }

  hideDateGraph() {
    this.store.dispatch(new HideDateGraph());
  }

  debugOn() {
    this.store.dispatch(new DebugOn());
  }

  debugOff() {
    this.store.dispatch(new DebugOff());
  }

  setTheme(theme: string) {
    this.store.dispatch(new SetTheme(theme));
  }
}
