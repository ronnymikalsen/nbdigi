import { NgModule } from '@angular/core';
import { DebugModule } from '../debug/debug.module';
import { ItemMenuModule } from '../shared/item-menu/item-menu.module';
import { SharedModule } from '../shared/shared.module';
import { DefaultItemCardComponent } from './containers/default-item-card/default-item-card.component';

@NgModule({
  imports: [SharedModule, DebugModule, ItemMenuModule],
  declarations: [DefaultItemCardComponent],
  exports: [DefaultItemCardComponent]
})
export class ItemCardModule {}
