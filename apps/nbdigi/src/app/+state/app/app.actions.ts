import { Action } from '@ngrx/store';

export enum AppActionTypes {
  DebugOn = '[App] Debug on',
  DebugOff = '[App] Debug off',
  SetTheme = '[App] Set theme',
  ShowDateGraph = '[App] Show date graph',
  HideDateGraph = '[App] Hide date graph'
}

export class DebugOn implements Action {
  readonly type = AppActionTypes.DebugOn;
}

export class DebugOff implements Action {
  readonly type = AppActionTypes.DebugOff;
}

export class SetTheme implements Action {
  readonly type = AppActionTypes.SetTheme;

  constructor(public payload: string) {}
}

export class ShowDateGraph implements Action {
  readonly type = AppActionTypes.ShowDateGraph;
}

export class HideDateGraph implements Action {
  readonly type = AppActionTypes.HideDateGraph;
}

export type AppAction =
  | DebugOn
  | DebugOff
  | SetTheme
  | ShowDateGraph
  | HideDateGraph;

export const fromAppActions = {
  DebugOn,
  DebugOff,
  SetTheme,
  ShowDateGraph,
  HideDateGraph
};
