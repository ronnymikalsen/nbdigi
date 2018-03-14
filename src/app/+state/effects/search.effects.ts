import { MatSnackBar } from '@angular/material';
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
import { TypeaheadService } from './../../core/typeahead-service/typeahead.service';
import { Hints, Hint } from './../../core/typeahead-service/hints.model';
import { SearchCriteria } from '../../models/search-criteria.model';
import { SearchService } from './../../core/search-service/search.service';

@Injectable()
export class SearchEffects {
  @Effect()
  search: Observable<Action> = this.actions
    .ofType(
      search.SearchActionTypes.Search,
      search.SearchActionTypes.SetMediaType,
      search.SearchActionTypes.AddFilter,
      search.SearchActionTypes.RemoveFilter,
      search.SearchActionTypes.ToggleFilter,
      search.SearchActionTypes.SetSort
    )
    .pipe(
      withLatestFrom(this.store),
      switchMap(([action, storeState]) => {
        const hints = new Hints();
        const filters = this.addAllFilters(storeState);

        if (storeState.search.mediaType) {
          return this.searchService
            .search({
              size: 50,
              mediaType: storeState.search.mediaType,
              q: storeState.search.q,
              filters: filters,
              sort: storeState.search.sort
            })
            .pipe(
              map(searchResult => {
                return new search.SearchSuccess(searchResult);
              }),
              catchError(err => Observable.of(new search.SearchError(err)))
            );
        } else {
          return this.searchService
            .super({
              size: 20,
              q: storeState.search.q,
              filters: filters,
              sort: storeState.search.sort
            })
            .pipe(
              map(searchResult => {
                return new search.SearchSuccess(searchResult);
              }),
              catchError(err => Observable.of(new search.SearchError(err)))
            );
        }
      })
    );

  @Effect()
  searchAggregator: Observable<Action> = this.actions
    .ofType(
      search.SearchActionTypes.SearchSuccess,
      search.SearchActionTypes.SearchAggs
    )
    .pipe(
      withLatestFrom(this.store),
      switchMap(([action, storeState]) => {
        const hints = new Hints();
        const filters = this.addAllFilters(storeState);

        return this.searchService
          .search({
            size: 1,
            q: storeState.search.q,
            filters: filters,
            sort: storeState.search.sort
          })
          .pipe(
            map(searchResult => {
              return new search.SearchAggsSuccess(searchResult);
            }),
            catchError(err => Observable.of(new search.SearchAggsError(err)))
          );
      })
    );

  @Effect()
  loadMore: Observable<Action> = this.actions
    .ofType(search.SearchActionTypes.LoadMore)
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
        } else if (storeState.search.mediaType === 'kart') {
          url = storeState.search.searchResult.maps.nextLink;
        } else if (storeState.search.mediaType === 'noter') {
          url = storeState.search.searchResult.musicBooks.nextLink;
        } else if (storeState.search.mediaType === 'musikkmanuskripter') {
          url = storeState.search.searchResult.musicManuscripts.nextLink;
        } else if (storeState.search.mediaType === 'plakater') {
          url = storeState.search.searchResult.posters.nextLink;
        } else if (storeState.search.mediaType === 'privatarkivmateriale') {
          url = storeState.search.searchResult.privateArchives.nextLink;
        } else if (storeState.search.mediaType === 'programrapporter') {
          url = storeState.search.searchResult.programReports.nextLink;
        } else if (storeState.search.mediaType === 'others') {
          url = storeState.search.searchResult.others.nextLink;
        }
        return this.searchService
          .searchByUrl(storeState.search.mediaType, url)
          .pipe(
            map(searchResult => {
              return new search.LoadMoreSuccess(searchResult);
            }),
            catchError(err => {
              return Observable.of(new search.SearchError(err));
            })
          );
      })
    );

  @Effect({ dispatch: false })
  error: Observable<Action> = this.actions
    .ofType(search.SearchActionTypes.SearchError)
    .pipe(
      tap(() => {
        this.snackBar.open('Det har oppstått en feil', null, {
          duration: 2000,
          panelClass: 'error'
        });
      })
    );

  @Effect()
  loadHints: Observable<Action> = this.actions
    .ofType(search.SearchActionTypes.LoadHints)
    .pipe(
      withLatestFrom(this.store),
      switchMap(([action, storeState]) => {
        const hints = new Hints();
        const filters = this.addAllFilters(storeState);
        const sc = {
          size: 50,
          mediaType: storeState.search.mediaType,
          q: storeState.search.q,
          filters: filters,
          sort: storeState.search.sort
        };
        return this.typeaheadService.creators(sc).pipe(
          map((h: Hint[]) => (hints.creators = h)),
          mergeMap(h => this.typeaheadService.places(sc)),
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
    private searchService: SearchService,
    public snackBar: MatSnackBar
  ) {}

  private addAllFilters(storeState): string[] {
    let filters = [
      ...storeState.search.filters.filter(h => h.enabled).map(h => h.value)
    ];

    if (storeState.session.user.email !== 'ronny.mikalsen@gmail.com') {
      filters = [
        ...filters,
        'contentClasses:ccbyncnd OR contentClasses:publicdomain OR contentClasses:ccbync'
      ];
    }
    filters = [...filters, 'digital:Ja'];
    filters = [...filters, 'contentClasses:jp2'];

    return filters;
  }
}
