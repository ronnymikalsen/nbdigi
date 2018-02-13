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

export const metaReducers: MetaReducer<State>[] = !environment.production
  ? [storeFreeze]
  : [];

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

/**
 * Search Reducers
 */
export const getSearchState = createFeatureSelector<fromSearch.State>('search');
export const getBooks = createSelector(getSearchState, fromSearch.getBooks);
export const getNewspapers = createSelector(
  getSearchState,
  fromSearch.getNewspapers
);
export const getPhotos = createSelector(getSearchState, fromSearch.getPhotos);
export const getPeriodicals = createSelector(
  getSearchState,
  fromSearch.getPeriodicals
);
export const getOthers = createSelector(getSearchState, fromSearch.getOthers);

/**
 * Item Reducers
 */
export const getItemState = createFeatureSelector<fromItem.State>('item');
export const getCurrentItem = createSelector(
  getItemState,
  fromItem.getCurrentItem
);
