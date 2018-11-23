import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Item } from '@nbdigi/data-models';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as itemAction from '../../+state/actions/item.actions';
import * as fromRoot from '../../+state/reducers';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nbd-viewer [item]="item | async" (change)="onChange($event)"> </nbd-viewer>
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
