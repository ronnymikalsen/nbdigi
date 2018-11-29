import { Action } from '@ngrx/store';

export enum AuthActionTypes {
  DebugOn = '[Session] Debug on',
  DebugOff = '[Session] Debug off',
  SetTheme = '[Session] Set theme',
  ShowDateGraph = '[Session] Show date graph',
  HideDateGraph = '[Session] Hide date graph'
}

export class DebugOn implements Action {
  readonly type = AuthActionTypes.DebugOn;
}

export class DebugOff implements Action {
  readonly type = AuthActionTypes.DebugOff;
}

export class SetTheme implements Action {
  readonly type = AuthActionTypes.SetTheme;

  constructor(public payload: string) {}
}

export class ShowDateGraph implements Action {
  readonly type = AuthActionTypes.ShowDateGraph;
}

export class HideDateGraph implements Action {
  readonly type = AuthActionTypes.HideDateGraph;
}

export type AuthAction =
  | DebugOn
  | DebugOff
  | SetTheme
  | ShowDateGraph
  | HideDateGraph;
