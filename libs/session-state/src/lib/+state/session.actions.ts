import {
  Authenticate,
  AuthError as AuthErrorModel,
  User
} from '@nbdigi/data-models';
import { Action } from '@ngrx/store';

export enum SessionActionTypes {
  SignUpWithEmailAndPassword = '[Session] Sign up with email and password',
  SignInWithGoogle = '[Session] Sign in with Google',
  SignInWithEmailAndPassword = '[Session] Sign in with email and password',
  SignedIn = '[Session] Signed in',
  SignInWithGoogleSuccess = '[Session] Sign in with Google success',
  SignInWithEmailAndPasswordSuccess = '[Session] Sign in with email and password success',
  SignOut = '[Session] Sign out',
  SignedOut = '[Session] Signed out',
  AuthError = '[Session] Auth error',
  SignUpError = '[Session] Sign up error',
  SignUpSuccess = '[Session] Sign up success',
  SendPasswordResetEmail = '[Session] Send password reset email',
  SendPasswordResetEmaildSuccess = '[Session] Password reset email sendt',
  DebugOn = '[Session] Debug on',
  DebugOff = '[Session] Debug off',
  SetTheme = '[Session] Set theme',
  ShowDateGraph = '[Session] Show date graph',
  HideDateGraph = '[Session] Hide date graph'
}

export class SignUpWithEmailAndPassword implements Action {
  readonly type = SessionActionTypes.SignUpWithEmailAndPassword;

  constructor(public payload: Authenticate) {}
}

export class SignInWithGoogle implements Action {
  readonly type = SessionActionTypes.SignInWithGoogle;
}

export class SignInWithEmailAndPassword implements Action {
  readonly type = SessionActionTypes.SignInWithEmailAndPassword;

  constructor(public payload: Authenticate) {}
}

export class SignedIn implements Action {
  readonly type = SessionActionTypes.SignedIn;

  constructor(public payload: User) {}
}

export class SignOut implements Action {
  readonly type = SessionActionTypes.SignOut;
}

export class SignedOut implements Action {
  readonly type = SessionActionTypes.SignedOut;
}

export class AuthError implements Action {
  readonly type = SessionActionTypes.AuthError;

  constructor(public payload: AuthErrorModel) {}
}

export class SignUpError implements Action {
  readonly type = SessionActionTypes.SignUpError;

  constructor(public payload: AuthError) {}
}

export class SignUpSuccess implements Action {
  readonly type = SessionActionTypes.SignUpSuccess;
}

export class SignInWithGoogleSuccess implements Action {
  readonly type = SessionActionTypes.SignInWithGoogleSuccess;
}

export class SignInWithEmailAndPasswordSuccess implements Action {
  readonly type = SessionActionTypes.SignInWithEmailAndPasswordSuccess;
}

export class SendPasswordResetEmail implements Action {
  readonly type = SessionActionTypes.SendPasswordResetEmail;

  constructor(public payload: string) {}
}

export class SendPasswordResetEmaildSuccess implements Action {
  readonly type = SessionActionTypes.SendPasswordResetEmaildSuccess;
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
  | SignUpWithEmailAndPassword
  | SignInWithGoogle
  | SignInWithEmailAndPassword
  | SignedIn
  | SignInWithGoogleSuccess
  | SignInWithEmailAndPasswordSuccess
  | SignOut
  | SignedOut
  | AuthError
  | SignUpError
  | SignUpSuccess
  | SendPasswordResetEmail
  | SendPasswordResetEmaildSuccess
  | DebugOn
  | DebugOff
  | SetTheme
  | ShowDateGraph
  | HideDateGraph;

export const fromSessionActions = {
  SignUpWithEmailAndPassword,
  SignInWithGoogle,
  SignInWithEmailAndPassword,
  SignedIn,
  SignInWithGoogleSuccess,
  SignInWithEmailAndPasswordSuccess,
  SignOut,
  SignedOut,
  AuthError,
  SignUpError,
  SignUpSuccess,
  SendPasswordResetEmail,
  SendPasswordResetEmaildSuccess,
  DebugOn,
  DebugOff,
  SetTheme,
  ShowDateGraph,
  HideDateGraph
};
