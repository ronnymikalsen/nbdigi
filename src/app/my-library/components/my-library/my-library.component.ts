import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromRoot from './../../../+state/reducers';
import { FavoriteList } from './../../../models/favorite-list';

@Component({
  selector: 'app-my-library',
  templateUrl: './my-library.component.html',
  styleUrls: ['./my-library.component.scss']
})
export class MyLibraryComponent implements OnInit {
  favoriteLists: Observable<FavoriteList[]> = this.store.select(
    fromRoot.getFavoriteList
  );

  constructor(private store: Store<fromRoot.State>) {}

  ngOnInit() {}
}
