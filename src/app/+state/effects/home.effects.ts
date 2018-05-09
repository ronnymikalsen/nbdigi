import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
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
import { SortOptions } from '../../models/sort-options';

@Injectable()
export class HomeEffects {
  @Effect()
  loadNewItems: Observable<Action> = this.actions
    .ofType(home.HomeActionTypes.LoadNewItems)
    .pipe(
      withLatestFrom(this.store),
      switchMap(([action, storeState]) => {
        const filters = this.addAllFilters(storeState);
        return this.searchService
          .super({
            q: '-pleasecacheme',
            size: 20,
            filters: filters,
            sort: new SortOptions().newArrivals
          })
          .pipe(
            map(searchResult => {
              return new home.LoadNewItemsSuccess(searchResult);
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
