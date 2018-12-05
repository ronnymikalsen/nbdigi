import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ItemFacade } from '../../../+state/item/item.facade';
import { Item } from '../../../core/models';
import { Manifest } from '../../../core/models/manifest';
import { ItemMenuButtonComponentConfig } from '../../item-menu/item-menu-button/item-menu-button.component';

@Component({
  selector: 'nbd-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.scss']
})
export class ItemDetailsComponent implements OnInit {
  item$: Observable<Item>;
  manifest$: Observable<Manifest>;
  loading$: Observable<boolean>;
  config = new ItemMenuButtonComponentConfig({
    direction: 'horiz',
    enableShowDetails: false
  });

  constructor(private itemFacade: ItemFacade) {}

  ngOnInit() {
    this.item$ = this.itemFacade.getCurrentItemDetails$;
    this.manifest$ = this.itemFacade.getItemCurrentManifest$;
    this.loading$ = this.itemFacade.getItemLoading$;
  }

  close() {
    this.itemFacade.closeItemDetails();
  }
}
