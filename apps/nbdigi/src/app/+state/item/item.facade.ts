import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Item } from '../../core/models';
import {
  Change,
  CloseItemDetails,
  Open,
  OpenItemDetails
} from './item.actions';
import { ItemPartialState } from './item.reducer';
import { itemQuery } from './item.selectors';

@Injectable()
export class ItemFacade {
  getCurrentItem$ = this.store.pipe(select(itemQuery.getCurrentItem));
  getCurrentItemDetails$ = this.store.pipe(
    select(itemQuery.getCurrentItemDetails)
  );
  getItemCurrentManifest$ = this.store.pipe(
    select(itemQuery.getCurrentItemDetailsManifest)
  );
  getItemLoading$ = this.store.pipe(select(itemQuery.getLoading));
  showItemDetails$ = this.store.pipe(select(itemQuery.showItemDetails));

  constructor(private store: Store<ItemPartialState>) {}

  open(item: Item): any {
    this.store.dispatch(new Open(item));
  }

  openItemDetails(item: Item): void {
    this.store.dispatch(new OpenItemDetails(item));
  }

  closeItemDetails(): void {
    this.store.dispatch(new CloseItemDetails());
  }

  change(item: Item| undefined | null): void {
    this.store.dispatch(new Change(item));
  }
}
