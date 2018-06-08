import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { Item } from '../../models/search-result.model';
import * as favoriteActions from './../../+state/actions/favorite.actions';
import * as fromRoot from './../../+state/reducers';
import { RemoveWarningDialogComponent } from '../remove-warning-dialog/remove-warning-dialog.component';
import { FavoriteList } from '../../models/favorite-list';

@Component({
  selector: 'app-item-menu-button',
  templateUrl: './item-menu-button.component.html',
  styleUrls: ['./item-menu-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemMenuButtonComponent implements OnInit {
  @Input() item: Item;
  @Input() list: FavoriteList;

  constructor(private store: Store<fromRoot.State>, public dialog: MatDialog) {}

  ngOnInit() {}

  addToFavorites(): void {
    this.store.dispatch(new favoriteActions.OpenDialog(this.item));
  }

  removeFromFavorites(): void {
    const dialogRef = this.dialog.open(RemoveWarningDialogComponent, {
      data: this.item
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.dispatch(
          new favoriteActions.RemoveFromList({
            id: this.list.id,
            items: [this.item]
          })
        );
      }
    });
  }
}
