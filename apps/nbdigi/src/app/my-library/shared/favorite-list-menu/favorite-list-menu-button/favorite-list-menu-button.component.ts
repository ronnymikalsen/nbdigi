import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { FavoriteFacade } from '../../../../+state/favorite/favorite.facade';
import { FavoriteList } from '../../../../core/models';

@Component({
  selector: 'nbd-favorite-list-menu-button',
  templateUrl: './favorite-list-menu-button.component.html',
  styleUrls: ['./favorite-list-menu-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FavoriteListMenuButtonComponent implements OnInit {
  @Input() favorite: FavoriteList;

  constructor(private favoriteFacade: FavoriteFacade) {}

  ngOnInit() {}

  openMenu(event: MouseEvent) {
    event.stopPropagation();
  }

  renameFavorite(list: FavoriteList) {
    this.favoriteFacade.openRenameListDialog(list);
  }
  removeFavorite(list: FavoriteList) {
    this.favoriteFacade.removeList(list);
  }

  OpenAddToListDialog(list: FavoriteList) {
    this.favoriteFacade.removeList(list);
  }
}
