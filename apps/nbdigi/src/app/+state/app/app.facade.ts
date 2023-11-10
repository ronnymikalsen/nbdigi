import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import {
  DebugOff,
  DebugOn,
  HideDateGraph,
  SetTheme,
  ShowDateGraph,
} from './app.actions';
import { AppPartialState } from './app.reducer';
import { appQuery } from './app.selectors';

@Injectable()
export class AppFacade {
  isDebugOn$ = this.store.pipe(select(appQuery.isDebugOn));
  showDateGraph$ = this.store.pipe(select(appQuery.showDateGraph));
  currentTheme$ = this.store.pipe(select(appQuery.getTheme));
  constructor(private store: Store<AppPartialState>) {}

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
