import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';

import { Item } from '../../models/search-result.model';
import { ViewerPageComponent } from '../../viewer/containers/viewer-page';

@Injectable()
export class ViewerService {
  constructor(public dialog: MatDialog) {}

  open(item: Item) {
    const dialogRef = this.dialog.open(ViewerPageComponent, {
      width: '100%',
      height: '100%',
      data: item,
      panelClass: ['viewer-panel']
    });
  }
}
