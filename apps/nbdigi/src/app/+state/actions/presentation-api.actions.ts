import { Action } from '@ngrx/store';
import { Manifest } from '../../core/models/manifest';

export enum PresentationApiActionTypes {
  LoadSuccess = '[Presentation/API] Load Success',
  LoadFailure = '[Presentation/API] Load Failure'
}

export class LoadSuccess implements Action {
  readonly type = PresentationApiActionTypes.LoadSuccess;

  constructor(public payload: Manifest) {}
}

export class LoadFailure implements Action {
  readonly type = PresentationApiActionTypes.LoadFailure;

  constructor(public payload: string) {}
}

export type PresentationApiActionsUnion = LoadSuccess | LoadFailure;
