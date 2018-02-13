import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromRoot from './../../+state/reducers';
import { getCurrentItem } from './../../+state/reducers/item.reducer';
import { getItemState } from './../../+state/reducers/index';
import { Item } from '../../models/search-result.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<app-viewer [item]="item | async"></app-viewer>`
})
export class ViewerPageComponent {
  item: Observable<Item> = this.store.select(fromRoot.getCurrentItem);

  constructor(
    public dialogRef: MatDialogRef<ViewerPageComponent>,
    private store: Store<fromRoot.State>
  ) {}
}
