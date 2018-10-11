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
import { AuthActionTypes } from '../actions/session.actions';
import * as fromFavorite from './favorite.reducer';
import * as fromHome from './home.reducer';
import * as fromItem from './item.reducer';
import * as fromSearch from './search.reducer';
import * as fromSession from './session.reducer';

export interface State {
  session: fromSession.State;
  home: fromHome.State;
  search: fromSearch.State;
  item: fromItem.State;
  favorite: fromFavorite.State;
  router: fromRouter.RouterReducerState<RouterStateUrl>;
}

export const reducers: ActionReducerMap<State> = {
  session: fromSession.reducer,
  home: fromHome.reducer,
  search: fromSearch.reducer,
  item: fromItem.reducer,
  favorite: fromFavorite.reducer,
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
 * Home Reducers
 */
export const getHomeState = createFeatureSelector<fromHome.State>('home');
export const getNewBooks = createSelector(getHomeState, fromHome.getNewBooks);
export const getNewPeriodicals = createSelector(
  getHomeState,
  fromHome.getNewPeriodicals
);
export const getNewPhotos = createSelector(getHomeState, fromHome.getNewPhotos);
export const getNewNewspapers = createSelector(
  getHomeState,
  fromHome.getNewNewspapers
);
export const getNewOthers = createSelector(getHomeState, fromHome.getNewOthers);

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
export const showDateGraph = createSelector(
  getSessionState,
  fromSession.showDateGraph
);
export const currentTheme = createSelector(
  getSessionState,
  fromSession.getTheme
);

/**
 * Search Reducers
 */
export const getSearchState = createFeatureSelector<fromSearch.State>('search');
export const getQ = createSelector(getSearchState, fromSearch.getQ);
export const getCriteria = createSelector(
  getSearchState,
  fromSearch.getCriteria
);
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
export const getCurrentMediaTypeCount = createSelector(
  getSearchState,
  fromSearch.getCurrentMediaTypeCount
);
export const getYears = createSelector(getSearchState, fromSearch.getYears);
export const getMonths = createSelector(getSearchState, fromSearch.getMonths);

/**
 * Item Reducers
 */
export const getItemState = createFeatureSelector<fromItem.State>('item');
export const getCurrentItem = createSelector(
  getItemState,
  fromItem.getCurrentItem
);
export const getItemCurrentManifest = createSelector(
  getItemState,
  fromItem.getCurrentManifest
);
export const getItemLoading = createSelector(getItemState, fromItem.getLoading);
export const showItemDetails = createSelector(
  getItemState,
  fromItem.showItemDetails
);

/**
 * Favorite Reducers
 */
export const getFavoriteState = createFeatureSelector<fromFavorite.State>(
  'favorite'
);
export const getFavoriteList = createSelector(
  getFavoriteState,
  fromFavorite.getLists
);
export const getCurrentList = createSelector(
  getFavoriteState,
  fromFavorite.getSelectedList
);
