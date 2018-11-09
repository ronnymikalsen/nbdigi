import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { Manifest } from '../../../../core/presentation-service/manifest';

@Component({
  selector: 'nbd-item-details-metadata',
  templateUrl: './item-details-metadata.component.html',
  styleUrls: ['./item-details-metadata.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemDetailsMetadataComponent implements OnInit {
  @Input() manifest: Manifest;

  constructor() {}

  ngOnInit() {}
}
