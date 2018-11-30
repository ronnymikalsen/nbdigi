import * as fromRouter from '@ngrx/router-store';
import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';
import { environment } from '../../../environments/environment';
import { RouterStateUrl } from '../../custom-serializer';
import { AuthActionTypes } from '../auth/auth.actions';
import * as fromItem from './item.reducer';
import * as fromSession from './session.reducer';

export interface State {
  session: fromSession.State;
  item: fromItem.State;
  router: fromRouter.RouterReducerState<RouterStateUrl>;
}

export const reducers: ActionReducerMap<State> = {
  session: fromSession.reducer,
  item: fromItem.reducer,
  router: fromRouter.routerReducer
};

export function debug(reducer: ActionReducer<any>): ActionReducer<any> {
  return function(state, action) {
    switch (action.type) {
      case AuthActionTypes.SignedOut: {
        state = undefined;
      }
    }

    return reducer(state, action);
  };
}
export const metaReducers: MetaReducer<State>[] = !environment.production
  ? [storeFreeze, debug]
  : [debug];

/**
 * Settings Reducers
 */
export const getSessionState = createFeatureSelector<fromSession.State>(
  'session'
);
export const getAuthError = createSelector(
  getSessionState,
  fromSession.getError
);
export const isDebugOn = createSelector(
  getSessionState,
  fromSession.isDebugOn
);
export const showDateGraph = createSelector(
  getSessionState,
  fromSession.showDateGraph
);
export const currentTheme = createSelector(
  getSessionState,
  fromSession.getTheme
);

/**
 * Item Reducers
 */
export const getItemState = createFeatureSelector<fromItem.State>('item');
export const getCurrentItem = createSelector(
  getItemState,
  fromItem.getCurrentItem
);
export const getCurrentItemDetails = createSelector(
  getItemState,
  fromItem.getCurrentItemDetails
);
export const getItemCurrentManifest = createSelector(
  getItemState,
  fromItem.getCurrentItemDetailsManifest
);
export const getItemLoading = createSelector(
  getItemState,
  fromItem.getLoading
);
export const showItemDetails = createSelector(
  getItemState,
  fromItem.showItemDetails
);
