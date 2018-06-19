import { NgModule } from '@angular/core';
import { DebugModule } from './../debug/debug.module';
import { SharedModule } from './../shared/shared.module';
import { ItemCardModule } from './items-section/item-card/item-card.module';
import { ItemsSectionComponent } from './items-section/items-section.component';

@NgModule({
  imports: [SharedModule, DebugModule, ItemCardModule],
  declarations: [ItemsSectionComponent],
  exports: [ItemsSectionComponent]
})
export class ItemsSectionModule {}
