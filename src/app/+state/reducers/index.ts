import * as fromRouter from '@ngrx/router-store';
import { storeFreeze } from 'ngrx-store-freeze';
import {
  ActionReducerMap,
  createSelector,
  createFeatureSelector,
  ActionReducer,
  MetaReducer
} from '@ngrx/store';

import { environment } from '../../../environments/environment';
import { RouterStateUrl } from '../../custom-serializer';

import * as fromSession from './session.reducer';
import * as fromSearch from './search.reducer';
import * as fromItem from './item.reducer';
import { AuthActionTypes } from './../actions/session.actions';

export interface State {
  session: fromSession.State;
  search: fromSearch.State;
  item: fromItem.State;
  router: fromRouter.RouterReducerState<RouterStateUrl>;
}

export const reducers: ActionReducerMap<State> = {
  session: fromSession.reducer,
  search: fromSearch.reducer,
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
export const currentUser = createSelector(
  getSessionState,
  fromSession.currentUser
);
export const getAuthError = createSelector(
  getSessionState,
  fromSession.getError
);
export const isDebugOn = createSelector(getSessionState, fromSession.isDebugOn);

/**
 * Search Reducers
 */
export const getSearchState = createFeatureSelector<fromSearch.State>('search');
export const getQ = createSelector(getSearchState, fromSearch.getQ);
export const pristine = createSelector(getSearchState, fromSearch.pristine);
export const getBooks = createSelector(getSearchState, fromSearch.getBooks);
export const getNewspapers = createSelector(
  getSearchState,
  fromSearch.getNewspapers
);
export const getMaps = createSelector(getSearchState, fromSearch.getMaps);
export const getMusicBooks = createSelector(
  getSearchState,
  fromSearch.getMusicBooks
);
export const getMusicManuscripts = createSelector(
  getSearchState,
  fromSearch.getMusicManuscripts
);
export const getPosters = createSelector(getSearchState, fromSearch.getPosters);
export const getPrivateArchives = createSelector(
  getSearchState,
  fromSearch.getPrivateArchives
);
export const getProgramReports = createSelector(
  getSearchState,
  fromSearch.getProgramReports
);
export const getPhotos = createSelector(getSearchState, fromSearch.getPhotos);
export const getPeriodicals = createSelector(
  getSearchState,
  fromSearch.getPeriodicals
);
export const getOthers = createSelector(getSearchState, fromSearch.getOthers);
export const getMoreUrl = createSelector(getSearchState, fromSearch.getMoreUrl);

/**
 * Item Reducers
 */
export const getItemState = createFeatureSelector<fromItem.State>('item');
export const getCurrentItem = createSelector(
  getItemState,
  fromItem.getCurrentItem
);
