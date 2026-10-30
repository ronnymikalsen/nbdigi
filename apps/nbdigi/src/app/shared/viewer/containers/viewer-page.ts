import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ItemFacade } from '../../../+state/item/item.facade';
import { Item } from '../../../core/models';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="viewer-page">
      <nbd-viewer [item]="item | async" (change)="onChange($event)">
      </nbd-viewer>
    </div>
  `,
  styles: `
    .viewer-page {
      height: 100%;
      min-height: 0;
    }
  `,
  standalone: false,
})
export class ViewerPageComponent {
  item: Observable<Item | undefined>;

  constructor(
    public dialogRef: MatDialogRef<ViewerPageComponent>,
    private itemFacade: ItemFacade,
  ) {
    this.item = this.itemFacade.getCurrentItem$;
  }

  onChange(currentItem: Item | undefined | null) {
    this.itemFacade.change(currentItem);
  }
}
