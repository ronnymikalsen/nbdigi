import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../+state/reducers';
import { ItemDetailsComponent } from './../../shared/item-details/item-details/item-details.component';
import { ObservableMedia, MediaChange } from '@angular/flex-layout';

@Injectable({
  providedIn: 'root'
})
export class ItemDetailsService {
  private dialogRef: MatDialogRef<ItemDetailsComponent>;
  private showItemDetails: boolean;

  constructor(
    private store: Store<fromRoot.State>,
    public dialog: MatDialog,
    private media: ObservableMedia
  ) {}

  init() {
    this.media.subscribe((change: MediaChange) => {
      this.update();
    });

    this.store.select(fromRoot.showItemDetails).subscribe(show => {
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
