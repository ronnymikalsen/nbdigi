import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as favoriteActions from './../../../+state/actions/favorite.actions';
import * as fromRoot from './../../../+state/reducers';
import { Item } from './../../../models/search-result.model';

@Component({
  selector: 'app-favorite-button',
  templateUrl: './favorite-button.component.html',
  styleUrls: ['./favorite-button.component.scss']
})
export class FavoriteButtonComponent implements OnInit {
  item: Observable<Item> = this.store.select(fromRoot.getCurrentItem);

  constructor(private store: Store<fromRoot.State>) {}

  ngOnInit() {}

  openDialog(item: Item): void {
    this.store.dispatch(new favoriteActions.OpenDialog(item));
  }
}
