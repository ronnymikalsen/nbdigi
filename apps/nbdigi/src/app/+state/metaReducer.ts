import { ActionReducer } from '@ngrx/store';
import { AuthActionTypes } from './auth/auth.actions';

export function debug(reducer: ActionReducer<any>): ActionReducer<any> {
  return function (state, action) {
    switch (action.type) {
      case AuthActionTypes.SignedOut: {
        state = undefined;
      }
    }

    return reducer(state, action);
  };
}
