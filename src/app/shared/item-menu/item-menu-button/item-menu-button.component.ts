import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { FavoriteList } from '../../../models/favorite-list';
import { Item } from '../../../models/search-result.model';
import * as favoriteActions from '../../../+state/actions/favorite.actions';
import * as fromRoot from '../../../+state/reducers';
import * as itemActions from '../../../+state/actions/item.actions';

@Component({
  selector: 'app-item-menu-button',
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
    this.store.dispatch(new itemActions.Open(this.item));
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
  enableOpen = true;

  constructor(fields?: { enableOpen?: boolean }) {
    if (fields) {
      this.enableOpen =
        fields.enableOpen !== undefined ? fields.enableOpen : this.enableOpen;
    }
  }
}
