import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { mergeMap, switchMap, map, catchError, tap } from 'rxjs/operators';

import * as fromRoot from './../reducers';
import * as search from '../actions/search.actions';
import { LoadHints, SetQuery, SearchActionTypes } from './../actions/search.actions';
import { TypeaheadService } from './../../core/typeahead-service/typeahead.service';
import { Hints, Hint } from './../../core/typeahead-service/hints.model';

@Injectable()
export class SearchEffects {

  @Effect() 
  setQuery: Observable<Action> = this.actions.ofType(SearchActionTypes.SetQuery).pipe(
    map((action: SetQuery) => {
      return new search.LoadHints(action.payload);
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
    private actions: Actions,
    private typeaheadService: TypeaheadService
  ) {}
}
