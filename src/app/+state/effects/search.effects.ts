import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { mergeMap, switchMap, map, catchError, tap, withLatestFrom } from 'rxjs/operators';

import * as fromRoot from './../reducers';
import * as search from '../actions/search.actions';
import { LoadHints, SetQuery, SearchActionTypes, Search } from './../actions/search.actions';
import { TypeaheadService } from './../../core/typeahead-service/typeahead.service';
import { Hints, Hint } from './../../core/typeahead-service/hints.model';
import { SearchCriteria } from '../../models/search-criteria.model';
import { SearchResult } from './../../models/search-result.model';
import { SearchService } from './../../core/search-service/search.service';

@Injectable()
export class SearchEffects {

  @Effect()
  search: Observable<Action> = this.actions.ofType(SearchActionTypes.Search).pipe(
    withLatestFrom(this.store),
    switchMap(([action, storeState]) => {
      return this.searchService.search({
        q: storeState.search.q
      }).pipe(
        map(() => {
          return new search.SearchSuccess(new SearchResult());
        })
      );
    })

  );

  @Effect()
  loadHints: Observable<Action> = this.actions.ofType(SearchActionTypes.LoadHints).pipe(
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
