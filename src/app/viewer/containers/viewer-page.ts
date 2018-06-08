import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromRoot from './../../+state/reducers';
import * as favoriteActions from './../../+state/actions/favorite.actions';
import * as itemAction from './../../+state/actions/item.actions';
import { getCurrentItem } from './../../+state/reducers/item.reducer';
import { getItemState } from './../../+state/reducers/index';
import { Item } from '../../models/search-result.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-viewer
      [item]="item | async"
      (change)="onChange($event)">
    </app-viewer>
  `
})
export class ViewerPageComponent {
  item: Observable<Item> = this.store.select(fromRoot.getCurrentItem);

  constructor(
    public dialogRef: MatDialogRef<ViewerPageComponent>,
    private store: Store<fromRoot.State>
  ) {}

  onChange(currentItem: Item) {
    this.store.dispatch(new itemAction.Change(currentItem));
  }
}
