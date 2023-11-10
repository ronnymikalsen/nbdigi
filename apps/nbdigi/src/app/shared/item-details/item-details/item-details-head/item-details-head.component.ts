import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { ItemFacade } from '../../../../+state/item/item.facade';
import { Item } from '../../../../core/models';
@Component({
  selector: 'nbd-item-details-head',
  templateUrl: './item-details-head.component.html',
  styleUrls: ['./item-details-head.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemDetailsHeadComponent implements OnInit {
  @Input() item!: Item;

  constructor(private itemFacade: ItemFacade) {}

  ngOnInit() {}

  open(item: Item): void {
    this.itemFacade.open(item);
  }
}
