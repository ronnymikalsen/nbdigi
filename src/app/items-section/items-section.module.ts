import { NgModule } from '@angular/core';

import { ItemCardModule } from './../item-card/item-card.module';
import { DebugModule } from './../debug/debug.module';
import { ItemsSectionComponent } from './items-section/items-section.component';
import { SharedModule } from './../shared/shared.module';

@NgModule({
  imports: [SharedModule, DebugModule, ItemCardModule],
  declarations: [ItemsSectionComponent],
  exports: [ItemsSectionComponent]
})
export class ItemsSectionModule {}
