import { Action } from '@ngrx/store';
import { Entity } from './authenticationstate.reducer';

export enum AuthenticationstateActionTypes {
  LoadAuthenticationstate = '[Authenticationstate] Load Authenticationstate',
  AuthenticationstateLoaded = '[Authenticationstate] Authenticationstate Loaded',
  AuthenticationstateLoadError = '[Authenticationstate] Authenticationstate Load Error'
}

export class LoadAuthenticationstate implements Action {
  readonly type = AuthenticationstateActionTypes.LoadAuthenticationstate;
}

export class AuthenticationstateLoadError implements Action {
  readonly type = AuthenticationstateActionTypes.AuthenticationstateLoadError;
  constructor(public payload: any) {}
}

export class AuthenticationstateLoaded implements Action {
  readonly type = AuthenticationstateActionTypes.AuthenticationstateLoaded;
  constructor(public payload: Entity[]) {}
}

export type AuthenticationstateAction =
  | LoadAuthenticationstate
  | AuthenticationstateLoaded
  | AuthenticationstateLoadError;

export const fromAuthenticationstateActions = {
  LoadAuthenticationstate,
  AuthenticationstateLoaded,
  AuthenticationstateLoadError
};
