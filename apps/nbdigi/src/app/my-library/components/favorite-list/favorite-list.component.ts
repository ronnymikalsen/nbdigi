import { Component, Input, OnInit } from '@angular/core';
import { ObservableMedia } from '@angular/flex-layout';
import { FavoriteList, MediaTypeResults } from '@nbdigi/data-models';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromRoot from '../../../+state/reducers';

@Component({
  selector: 'nbd-favorite-list',
  templateUrl: './favorite-list.component.html',
  styleUrls: ['./favorite-list.component.scss']
})
export class FavoriteListComponent implements OnInit {
  @Input() items: MediaTypeResults;
  @Input() list: FavoriteList;
  @Input() isDebugOn: boolean;
  showItemDetails: Observable<boolean> = this.store.select(
    fromRoot.showItemDetails
  );

  constructor(
    private store: Store<fromRoot.State>,
    public media: ObservableMedia
  ) {}

  ngOnInit() {}
}
