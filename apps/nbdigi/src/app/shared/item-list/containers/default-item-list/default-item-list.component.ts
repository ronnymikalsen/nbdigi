import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { Observable } from 'rxjs';
import { ItemFacade } from '../../../../+state/item/item.facade';
import { SessionFacade } from '../../../../+state/session/session.facade';
import { Item } from '../../../../core/models';

@Component({
  selector: 'nbd-default-item-list',
  templateUrl: './default-item-list.component.html',
  styleUrls: ['./default-item-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DefaultItemListComponent implements OnInit {
  @Input() item: Item;
  @Input() config = new DefaultItemListComponentConfig();
  isDebugOn: Observable<boolean> = this.sessionFacade.isDebugOn$;

  constructor(
    private sessionFacade: SessionFacade,
    private itemFacade: ItemFacade
  ) {}

  ngOnInit() {}

  open(item: Item): void {
    this.itemFacade.open(item);
  }
}

export class DefaultItemListComponentConfig {
  showMediaType? = true;
}
