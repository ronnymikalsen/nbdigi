import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import {
  mergeMap,
  switchMap,
  map,
  catchError,
  tap,
  withLatestFrom
} from 'rxjs/operators';

import * as fromRoot from './../reducers';
import * as search from '../actions/search.actions';
import {
  LoadHints,
  SetQuery,
  SearchActionTypes,
  Search
} from './../actions/search.actions';
import { TypeaheadService } from './../../core/typeahead-service/typeahead.service';
import { Hints, Hint } from './../../core/typeahead-service/hints.model';
import { SearchCriteria } from '../../models/search-criteria.model';
import { SearchService } from './../../core/search-service/search.service';

@Injectable()
export class SearchEffects {
  @Effect()
  search: Observable<Action> = this.actions
    .ofType(
      SearchActionTypes.Search,
      SearchActionTypes.SetMediaType,
      SearchActionTypes.AddFilter,
      SearchActionTypes.RemoveFilter,
      SearchActionTypes.ToggleFilter
    )
    .pipe(
      withLatestFrom(this.store),
      switchMap(([action, storeState]) => {
        let filters = [
          ...storeState.search.filters.filter(h => h.enabled).map(h => h.value)
        ];

        if (storeState.session.user.email !== 'ronny.mikalsen@gmail.com') {
          filters = [
            ...filters,
            'contentClasses:ccbyncnd OR contentClasses:publicdomain OR contentClasses:ccbync'
          ];
        }

        if (storeState.search.mediaType) {
          return this.searchService
            .search({
              size: 50,
              mediaType: storeState.search.mediaType,
              q: storeState.search.q,
              filters: filters
            })
            .pipe(
              map(searchResult => {
                return new search.SearchSuccess(searchResult);
              })
            );
        } else {
          return this.searchService
            .super({
              size: 20,
              q: storeState.search.q,
              filters: filters
            })
            .pipe(
              map(searchResult => {
                return new search.SearchSuccess(searchResult);
              })
            );
        }

      })
    );

  @Effect()
  loadMore: Observable<Action> = this.actions
    .ofType(SearchActionTypes.LoadMore)
    .pipe(
      withLatestFrom(this.store),
      switchMap(([action, storeState]) => {
        let url: string;
        if (storeState.search.mediaType === 'bøker') {
          url = storeState.search.searchResult.books.nextLink;
        } else if (storeState.search.mediaType === 'bilder') {
          url = storeState.search.searchResult.photos.nextLink;
        } else if (storeState.search.mediaType === 'aviser') {
          url = storeState.search.searchResult.newspapers.nextLink;
        } else if (storeState.search.mediaType === 'tidsskrift') {
          url = storeState.search.searchResult.periodicals.nextLink;
        } else if (storeState.search.mediaType === 'others') {
          url = storeState.search.searchResult.others.nextLink;
        }
        return this.searchService
          .searchByUrl(storeState.search.mediaType, url)
          .pipe(
            map(searchResult => {
              return new search.LoadMoreSuccess(searchResult);
            })
          );
      })
    );

  @Effect()
  loadHints: Observable<Action> = this.actions
    .ofType(SearchActionTypes.LoadHints)
    .pipe(
      switchMap((action: LoadHints) => {
        const hints = new Hints();
        return this.typeaheadService.creators(action.payload).pipe(
          map((h: Hint[]) => (hints.creators = h)),
          mergeMap(h => this.typeaheadService.places(action.payload)),
          map((h: Hint[]) => (hints.places = h)),
          map(() => {
            return new search.HintsLoaded(hints);
          })
        );
      })
    );

  constructor(
    private store: Store<fromRoot.State>,
    private actions: Actions,
    private typeaheadService: TypeaheadService,
    private searchService: SearchService
  ) {}
}
