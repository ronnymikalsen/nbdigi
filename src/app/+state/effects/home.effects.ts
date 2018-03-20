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
import * as home from '../actions/home.actions';
import { SearchCriteria } from '../../models/search-criteria.model';
import { SearchService } from './../../core/search-service/search.service';

@Injectable()
export class HomeEffects {
  @Effect()
  loadNewBooks: Observable<Action> = this.actions
    .ofType(home.HomeActionTypes.LoadNewBooks)
    .pipe(
      withLatestFrom(this.store),
      switchMap(([action, storeState]) => {
        const filters = this.addAllFilters(storeState);
        return this.searchService
          .search({
            size: 20,
            mediaType: 'bøker',
            filters: filters,
            sort: 'firstDigitalContentTime,desc'
          })
          .pipe(
            map(searchResult => {
              return new home.LoadNewBooksSuccess(searchResult.books);
            }),
            catchError(err => Observable.of(new home.LoadError(err)))
          );
      })
    );

  @Effect()
  loadNewPeriodicals: Observable<Action> = this.actions
    .ofType(home.HomeActionTypes.LoadNewPeriodicals)
    .pipe(
      withLatestFrom(this.store),
      switchMap(([action, storeState]) => {
        const filters = this.addAllFilters(storeState);
        return this.searchService
          .search({
            size: 20,
            mediaType: 'tidsskrift',
            filters: filters,
            sort: 'firstDigitalContentTime,desc'
          })
          .pipe(
            map(searchResult => {
              return new home.LoadNewPeriodicalsSuccess(
                searchResult.periodicals
              );
            }),
            catchError(err => Observable.of(new home.LoadError(err)))
          );
      })
    );

  @Effect()
  loadNewPhotos: Observable<Action> = this.actions
    .ofType(home.HomeActionTypes.LoadNewPhotos)
    .pipe(
      withLatestFrom(this.store),
      switchMap(([action, storeState]) => {
        const filters = this.addAllFilters(storeState);
        return this.searchService
          .search({
            size: 20,
            mediaType: 'bilder',
            filters: filters,
            sort: 'firstDigitalContentTime,desc'
          })
          .pipe(
            map(searchResult => {
              return new home.LoadNewPhotosSuccess(searchResult.photos);
            }),
            catchError(err => Observable.of(new home.LoadError(err)))
          );
      })
    );

  constructor(
    private store: Store<fromRoot.State>,
    private actions: Actions,
    private searchService: SearchService
  ) {}

  private addAllFilters(storeState): string[] {
    let filters = [];

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
