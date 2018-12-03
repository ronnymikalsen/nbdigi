import { Component, Input, OnInit } from '@angular/core';
import { ObservableMedia } from '@angular/flex-layout';
import { Observable } from 'rxjs';
import { ItemFacade } from '../../../+state/item/item.facade';
import { FavoriteList, MediaTypeResults } from '../../../core/models';

@Component({
  selector: 'nbd-favorite-list',
  templateUrl: './favorite-list.component.html',
  styleUrls: ['./favorite-list.component.scss']
})
export class FavoriteListComponent implements OnInit {
  @Input() items: MediaTypeResults;
  @Input() list: FavoriteList;
  @Input() isDebugOn: boolean;
  showItemDetails: Observable<boolean> = this.itemFacade.showItemDetails$;

  constructor(public media: ObservableMedia, private itemFacade: ItemFacade) {}

  ngOnInit() {}
}
