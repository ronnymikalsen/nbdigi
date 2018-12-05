import { Action } from '@ngrx/store';
import {
  Authenticate,
  AuthError as AuthErrorModel,
  User
} from '../../core/models';

export enum AuthActionTypes {
  SignUpWithEmailAndPassword = '[Auth] Sign up with email and password',
  SignInWithGoogle = '[Auth] Sign in with Google',
  SignInWithEmailAndPassword = '[Auth] Sign in with email and password',
  SignedIn = '[Auth] Signed in',
  SignInWithGoogleSuccess = '[Auth] Sign in with Google success',
  SignInWithEmailAndPasswordSuccess = '[Auth] Sign in with email and password success',
  SignOut = '[Auth] Sign out',
  SignedOut = '[Auth] Signed out',
  AuthError = '[Auth] Auth error',
  SignUpError = '[Auth] Sign up error',
  SignUpSuccess = '[Auth] Sign up success',
  SendPasswordResetEmail = '[Auth] Send password reset email',
  SendPasswordResetEmaildSuccess = '[Auth] Password reset email sendt'
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
  | SendPasswordResetEmaildSuccess;

export const fromAuthActions = {
  SignInWithGoogle,
  SignInWithEmailAndPassword,
  SignedIn,
  SignOut,
  SignedOut,
  AuthError,
  SignUpError,
  SignUpSuccess,
  SignInWithGoogleSuccess,
  SignInWithEmailAndPasswordSuccess,
  SendPasswordResetEmail,
  SendPasswordResetEmaildSuccess
};
