import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { MatDialog } from '@angular/material';
import { FavoriteFacade } from '../../../+state/favorite/favorite.facade';
import { ItemFacade } from '../../../+state/item/item.facade';
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

  constructor(
    public dialog: MatDialog,
    private favoriteFacade: FavoriteFacade,
    private itemFacade: ItemFacade
  ) {}

  ngOnInit() {}

  open(): void {
    this.itemFacade.open(this.item);
  }

  openItemDetails(): void {
    this.itemFacade.openItemDetails(this.item);
  }

  addToFavorites(): void {
    this.favoriteFacade.openAddToListDialog(this.item);
  }

  removeFromFavorites(): void {
    this.favoriteFacade.removeFromList({
      id: this.list.id,
      items: [this.item]
    });
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
