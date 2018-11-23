import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { FavoriteList } from '@nbdigi/data-models';
import { Store } from '@ngrx/store';
import * as favoriteActions from '../../../../+state/actions/favorite.actions';
import * as fromRoot from '../../../../+state/reducers';

@Component({
  selector: 'nbd-favorite-list-menu-button',
  templateUrl: './favorite-list-menu-button.component.html',
  styleUrls: ['./favorite-list-menu-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FavoriteListMenuButtonComponent implements OnInit {
  @Input() favorite: FavoriteList;

  constructor(private store: Store<fromRoot.State>) {}

  ngOnInit() {}

  openMenu(event: MouseEvent) {
    event.stopPropagation();
  }

  renameFavorite(list: FavoriteList) {
    this.store.dispatch(new favoriteActions.OpenRenameListDialog(list));
  }
  removeFavorite(list: FavoriteList) {
    this.store.dispatch(new favoriteActions.RemoveList(list));
  }
}
