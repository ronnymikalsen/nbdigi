import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

import { FavoriteService } from '../../../core/favorite-service/favorite.service';
import { Item, MediaTypeResults } from '../../../models/search-result.model';
import * as fromRoot from './../../../+state/reducers';

@Component({
  templateUrl: './favorite-list-page.html',
  styleUrls: ['./favorite-list-page.scss']
})
export class FavoriteListPageComponent implements OnInit {
  items: Observable<MediaTypeResults>;
  isDebugOn: Observable<boolean> = this.store.select(fromRoot.isDebugOn);

  constructor(
    private route: ActivatedRoute,
    private favoriteService: FavoriteService,
    private store: Store<fromRoot.State>
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const selectedId = params.get('id');
      this.items = this.favoriteService
        .getItems(selectedId)
        .valueChanges()
        .pipe(
          map((i: Item[]) => {
            return new MediaTypeResults({
              items: i
            });
          })
        );
    });
  }
}
