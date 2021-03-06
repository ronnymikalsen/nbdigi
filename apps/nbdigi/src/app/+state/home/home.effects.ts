import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { SortOptions } from '../../core/models';
import { SearchService } from '../../core/services';
import {
  HomeActionTypes,
  LoadError,
  LoadNewItemsSuccess
} from './home.actions';
import { HomePartialState } from './home.reducer';

@Injectable()
export class HomeEffects {
  
  loadNewItems: Observable<Action> = createEffect(() => this.actions.pipe(
    ofType(HomeActionTypes.LoadNewItems),
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
            return new LoadNewItemsSuccess(searchResult);
          }),
          catchError(err => of(new LoadError(err)))
        );
    })
  ));

  constructor(
    private store: Store<HomePartialState>,
    private actions: Actions,
    private searchService: SearchService
  ) {}

  private addAllFilters(storeState): string[] {
    let filters = [];

    if (storeState.auth.user.email !== 'ronny.mikalsen@gmail.com') {
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
