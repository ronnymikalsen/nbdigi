import {
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy
} from '@angular/core';
import { Store } from '@ngrx/store';
import { FavoriteList } from '../../../../models/favorite-list';
import * as favoriteActions from '../../../../+state/actions/favorite.actions';
import * as fromRoot from '../../../../+state/reducers';

@Component({
  selector: 'app-favorite-list-menu-button',
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
