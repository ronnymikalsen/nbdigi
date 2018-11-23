import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { ItemActions } from '../../../+state/actions';
import * as favoriteActions from '../../../+state/actions/favorite.actions';
import * as fromRoot from '../../../+state/reducers';
import { FavoriteList, Item } from '../../../core/models';

@Component({
  selector: 'nbd-item-menu-button',
  templateUrl: './item-menu-button.component.html',
  styleUrls: ['./item-menu-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemMenuButtonComponent implements OnInit {
  @Input() item: Item;
  @Input() list: FavoriteList;
  @Input() config = new ItemMenuButtonComponentConfig();

  constructor(private store: Store<fromRoot.State>, public dialog: MatDialog) {}

  ngOnInit() {}

  open(): void {
    this.store.dispatch(new ItemActions.Open(this.item));
  }

  openItemDetails(): void {
    this.store.dispatch(new ItemActions.OpenItemDetails(this.item));
  }

  addToFavorites(): void {
    this.store.dispatch(new favoriteActions.OpenAddToListDialog(this.item));
  }

  removeFromFavorites(): void {
    this.store.dispatch(
      new favoriteActions.RemoveFromList({
        id: this.list.id,
        items: [this.item]
      })
    );
  }
}

export class ItemMenuButtonComponentConfig {
  direction = 'vert';
  enableOpen = true;
  enableShowDetails = true;

  constructor(fields?: {
    direction?: string;
    enableOpen?: boolean;
    enableShowDetails?: boolean;
  }) {
    if (fields) {
      this.direction =
        fields.direction !== undefined ? fields.direction : this.direction;
      this.enableOpen =
        fields.enableOpen !== undefined ? fields.enableOpen : this.enableOpen;
      this.enableShowDetails =
        fields.enableShowDetails !== undefined
          ? fields.enableShowDetails
          : this.enableShowDetails;
    }
  }
}
