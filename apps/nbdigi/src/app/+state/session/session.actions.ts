import { Action } from '@ngrx/store';

export enum SessionActionTypes {
  DebugOn = '[Session] Debug on',
  DebugOff = '[Session] Debug off',
  SetTheme = '[Session] Set theme',
  ShowDateGraph = '[Session] Show date graph',
  HideDateGraph = '[Session] Hide date graph'
}

export class DebugOn implements Action {
  readonly type = SessionActionTypes.DebugOn;
}

export class DebugOff implements Action {
  readonly type = SessionActionTypes.DebugOff;
}

export class SetTheme implements Action {
  readonly type = SessionActionTypes.SetTheme;

  constructor(public payload: string) {}
}

export class ShowDateGraph implements Action {
  readonly type = SessionActionTypes.ShowDateGraph;
}

export class HideDateGraph implements Action {
  readonly type = SessionActionTypes.HideDateGraph;
}

export type SessionAction =
  | DebugOn
  | DebugOff
  | SetTheme
  | ShowDateGraph
  | HideDateGraph;

export const fromSessionActions = {
  DebugOn,
  DebugOff,
  SetTheme,
  ShowDateGraph,
  HideDateGraph
};
