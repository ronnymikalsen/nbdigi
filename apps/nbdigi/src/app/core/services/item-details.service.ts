import { Injectable } from '@angular/core';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ItemFacade } from '../../+state/item/item.facade';
import { ItemDetailsComponent } from '../../shared/item-details/item-details/item-details.component';

@Injectable({
  providedIn: 'root'
})
export class ItemDetailsService {
  private dialogRef: MatDialogRef<ItemDetailsComponent>;
  private showItemDetails: boolean;

  constructor(
    public dialog: MatDialog,
    private media: ObservableMedia,
    private itemFacade: ItemFacade
  ) {}

  init() {
    this.media.subscribe((change: MediaChange) => {
      this.update();
    });

    this.itemFacade.showItemDetails$.subscribe(show => {
      this.showItemDetails = show;
      this.update();
    });
  }

  private update() {
    if (this.showItemDetails && this.media.isActive('lt-md')) {
      if (!this.dialogRef) {
        this.dialogRef = this.dialog.open(ItemDetailsComponent, {
          width: '100%',
          height: '100%',
          data: null,
          panelClass: ['viewer-panel']
        });
      }
    } else {
      if (this.dialogRef) {
        this.dialogRef.close();
        this.dialogRef = undefined;
      }
    }
  }
}
