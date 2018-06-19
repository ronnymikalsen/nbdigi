import { NgModule } from '@angular/core';
import { SharedModule } from '../shared.module';
import { ItemMenuButtonComponent } from './item-menu-button/item-menu-button.component';

@NgModule({
  imports: [SharedModule],
  declarations: [ItemMenuButtonComponent],
  exports: [ItemMenuButtonComponent]
})
export class ItemMenuModule {}
