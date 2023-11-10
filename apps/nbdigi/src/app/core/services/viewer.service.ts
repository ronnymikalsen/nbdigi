import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Item } from '../../core/models';
import { ViewerPageComponent } from '../../shared/viewer/containers/viewer-page';

@Injectable()
export class ViewerService {
  constructor(public dialog: MatDialog) {}

  open(item: Item) {
    this.dialog.open(ViewerPageComponent, {
      width: '100%',
      height: '100%',
      data: item,
      panelClass: ['viewer-panel'],
    });
  }
}
