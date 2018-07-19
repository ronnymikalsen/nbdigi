import { Action } from '@ngrx/store';

import { Authenticate } from '../../models/auth.model';
import { User } from '../../models/user.model';
import { AuthError as AuthErrorModel } from '../../models/auth-error.model';
import { ResetPassword } from '../../models/password-reset.model';

export enum AuthActionTypes {
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
  SetTheme = '[Session] Set theme'
}

export class SignUpWithEmailAndPassword implements Action {
  readonly type = AuthActionTypes.SignUpWithEmailAndPassword;

  constructor(public payload: Authenticate) {}
}

export class SignInWithGoogle implements Action {
  readonly type = AuthActionTypes.SignInWithGoogle;
}

export class SignInWithEmailAndPassword implements Action {
  readonly type = AuthActionTypes.SignInWithEmailAndPassword;

  constructor(public payload: Authenticate) {}
}

export class SignedIn implements Action {
  readonly type = AuthActionTypes.SignedIn;

  constructor(public payload: User) {}
}

export class SignOut implements Action {
  readonly type = AuthActionTypes.SignOut;
}

export class SignedOut implements Action {
  readonly type = AuthActionTypes.SignedOut;
}

export class AuthError implements Action {
  readonly type = AuthActionTypes.AuthError;

  constructor(public payload: AuthErrorModel) {}
}

export class SignUpError implements Action {
  readonly type = AuthActionTypes.SignUpError;

  constructor(public payload: AuthError) {}
}

export class SignUpSuccess implements Action {
  readonly type = AuthActionTypes.SignUpSuccess;
}

export class SignInWithGoogleSuccess implements Action {
  readonly type = AuthActionTypes.SignInWithGoogleSuccess;
}

export class SignInWithEmailAndPasswordSuccess implements Action {
  readonly type = AuthActionTypes.SignInWithEmailAndPasswordSuccess;
}

export class SendPasswordResetEmail implements Action {
  readonly type = AuthActionTypes.SendPasswordResetEmail;

  constructor(public payload: string) {}
}

export class SendPasswordResetEmaildSuccess implements Action {
  readonly type = AuthActionTypes.SendPasswordResetEmaildSuccess;
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

export type AuthAction =
  | SignInWithGoogle
  | SignInWithEmailAndPassword
  | SignedIn
  | SignOut
  | SignedOut
  | AuthError
  | SignUpError
  | SignUpSuccess
  | SignInWithGoogleSuccess
  | SignInWithEmailAndPasswordSuccess
  | SendPasswordResetEmail
  | SendPasswordResetEmaildSuccess
  | DebugOn
  | DebugOff
  | SetTheme;
