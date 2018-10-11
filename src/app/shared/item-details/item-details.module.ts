import { NgModule } from '@angular/core';
import { SharedModule } from '../shared.module';
import { ItemDetailsHeadComponent } from './item-details/item-details-head/item-details-head.component';
import { ItemDetailsMetadataComponent } from './item-details/item-details-metadata/item-details-metadata.component';
import { ItemDetailsComponent } from './item-details/item-details.component';

@NgModule({
  imports: [SharedModule],
  declarations: [
    ItemDetailsComponent,
    ItemDetailsHeadComponent,
    ItemDetailsMetadataComponent
  ],
  exports: [ItemDetailsComponent]
})
export class ItemDetailsModule {}
