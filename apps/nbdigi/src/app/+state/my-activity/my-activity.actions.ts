import { Action } from '@ngrx/store';
import { Entity } from './my-activity.reducer';

export enum MyActivityActionTypes {
  LoadMyActivity = '[MyActivity] Load MyActivity',
  MyActivityLoaded = '[MyActivity] MyActivity Loaded',
  MyActivityLoadError = '[MyActivity] MyActivity Load Error'
}

export class LoadMyActivity implements Action {
  readonly type = MyActivityActionTypes.LoadMyActivity;
}

export class MyActivityLoadError implements Action {
  readonly type = MyActivityActionTypes.MyActivityLoadError;
  constructor(public payload: any) {}
}

export class MyActivityLoaded implements Action {
  readonly type = MyActivityActionTypes.MyActivityLoaded;
  constructor(public payload: Entity[]) {}
}

export type MyActivityAction =
  | LoadMyActivity
  | MyActivityLoaded
  | MyActivityLoadError;

export const fromMyActivityActions = {
  LoadMyActivity,
  MyActivityLoaded,
  MyActivityLoadError
};
