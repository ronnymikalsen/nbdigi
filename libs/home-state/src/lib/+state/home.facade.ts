import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { HomePartialState } from './home.reducer';
import { homeQuery } from './home.selectors';

@Injectable()
export class HomeFacade {
  getNewBooks$ = this.store.pipe(select(homeQuery.getNewBooks));
  getNewPeriodicals$ = this.store.pipe(select(homeQuery.getNewPeriodicals));
  getNewPhotos$ = this.store.pipe(select(homeQuery.getNewPhotos));
  getNewNewspapers$ = this.store.pipe(select(homeQuery.getNewNewspapers));
  getNewOthers$ = this.store.pipe(select(homeQuery.getNewOthers));

  constructor(private store: Store<HomePartialState>) {}
}
