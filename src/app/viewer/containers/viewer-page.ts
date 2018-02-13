import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Item } from '../../models/search-result.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<app-viewer [item]="item"></app-viewer>`
})
export class ViewerPageComponent {
  private item: Item;

  constructor(
    public dialogRef: MatDialogRef<ViewerPageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Item
  ) {
    this.item = data;
  }
}
