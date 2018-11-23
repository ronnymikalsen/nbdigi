import { Injectable } from '@angular/core';

import { select, Store } from '@ngrx/store';

import { ItemPartialState } from './item.reducer';
import { itemQuery } from './item.selectors';
import { LoadItem } from './item.actions';

@Injectable()
export class ItemFacade {
  loaded$ = this.store.pipe(select(itemQuery.getLoaded));
  allItem$ = this.store.pipe(select(itemQuery.getAllItem));
  selectedItem$ = this.store.pipe(select(itemQuery.getSelectedItem));

  constructor(private store: Store<ItemPartialState>) {}

  loadAll() {
    this.store.dispatch(new LoadItem());
  }
}
