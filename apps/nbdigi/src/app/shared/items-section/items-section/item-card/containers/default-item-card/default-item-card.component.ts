import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { Observable } from 'rxjs';
import { AppFacade } from '../../../../../../+state/app/app.facade';
import { ItemFacade } from '../../../../../../+state/item/item.facade';
import { FavoriteList, Item } from '../../../../../../core/models';

@Component({
  selector: 'nbd-default-item-card',
  templateUrl: './default-item-card.component.html',
  styleUrls: ['./default-item-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DefaultItemCardComponent implements OnInit {
  @Input() item: Item;
  @Input() list: FavoriteList;
  isDebugOn: Observable<boolean> = this.appFacade.isDebugOn$;

  constructor(private appFacade: AppFacade, private itemFacade: ItemFacade) {}

  ngOnInit() {}

  open(item: Item): void {
    this.itemFacade.open(item);
  }
}
