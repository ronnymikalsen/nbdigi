import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { Item } from 'src/app/models/search-result.model';

@Component({
  selector: 'app-item-details-head',
  templateUrl: './item-details-head.component.html',
  styleUrls: ['./item-details-head.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemDetailsHeadComponent implements OnInit {
  @Input() item: Item;

  constructor() {}

  ngOnInit() {}
}
