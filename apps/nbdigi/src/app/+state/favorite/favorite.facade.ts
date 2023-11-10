import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { FavoriteList, Item } from '../../core/models';
import {
  AddList,
  OpenAddToListDialog,
  OpenList,
  OpenRenameListDialog,
  RemoveFromList,
  RemoveList,
  SetList,
} from './favorite.actions';
import { FavoritePartialState } from './favorite.reducer';
import { favoriteQuery } from './favorite.selectors';

@Injectable()
export class FavoriteFacade {
  getFavoriteList$ = this.store.pipe(select(favoriteQuery.getLists));
  getCurrentList$ = this.store.pipe(select(favoriteQuery.getSelectedList));

  constructor(private store: Store<FavoritePartialState>) {}

  setList(list: any) {
    this.store.dispatch(new SetList(list));
  }

  addList(listName: string): void {
    this.store.dispatch(new AddList(listName));
  }

  openList(listId: string): void {
    this.store.dispatch(new OpenList(listId));
  }

  openRenameListDialog(list: FavoriteList): void {
    this.store.dispatch(new OpenRenameListDialog(list));
  }

  removeList(list: FavoriteList): void {
    this.store.dispatch(new RemoveList(list));
  }

  openAddToListDialog(item: Item): void {
    this.store.dispatch(new OpenAddToListDialog(item));
  }

  removeFromList(list: FavoriteList): void {
    this.store.dispatch(new RemoveFromList(list));
  }
}
