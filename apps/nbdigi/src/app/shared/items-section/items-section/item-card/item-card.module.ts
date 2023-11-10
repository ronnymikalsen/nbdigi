import { NgModule } from '@angular/core';
import { DebugModule } from '../../../debug/debug.module';
import { ItemMenuModule } from '../../../item-menu/item-menu.module';
import { SharedModule } from '../../../shared.module';
import { DefaultItemCardComponent } from './containers/default-item-card/default-item-card.component';

@NgModule({
  imports: [SharedModule, DebugModule, ItemMenuModule],
  declarations: [DefaultItemCardComponent],
  exports: [DefaultItemCardComponent],
})
export class ItemCardModule {}
