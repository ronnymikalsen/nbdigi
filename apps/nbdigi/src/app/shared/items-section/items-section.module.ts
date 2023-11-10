import { NgModule } from '@angular/core';
import { ItemListModule } from '../item-list/item-list.module';
import { DebugModule } from '../debug/debug.module';
import { SharedModule } from '../shared.module';
import { ItemCardModule } from './items-section/item-card/item-card.module';
import { ItemsSectionComponent } from './items-section/items-section.component';

@NgModule({
  imports: [SharedModule, DebugModule, ItemCardModule, ItemListModule],
  declarations: [ItemsSectionComponent],
  exports: [ItemsSectionComponent],
})
export class ItemsSectionModule {}
