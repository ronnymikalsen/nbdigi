import { AddToFavoriteListDialogComponent } from './../add-to-favorite-list-dialog/add-to-favorite-list-dialog.component';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromRoot from './../../../+state/reducers';
import { Item } from './../../../models/search-result.model';

@Component({
  selector: 'app-favorite-button',
  templateUrl: './favorite-button.component.html',
  styleUrls: ['./favorite-button.component.scss']
})
export class FavoriteButtonComponent implements OnInit {
  item: Observable<Item> = this.store.select(fromRoot.getCurrentItem);

  constructor(public dialog: MatDialog, private store: Store<fromRoot.State>) {}

  ngOnInit() {}

  openDialog(item: Item): void {
    const dialogRef = this.dialog.open(AddToFavoriteListDialogComponent, {
      data: {
        item: item
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
