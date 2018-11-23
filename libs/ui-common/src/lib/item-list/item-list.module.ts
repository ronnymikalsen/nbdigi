import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DefaultItemListComponent } from './containers/default-item-list/default-item-list.component';
import { SharedModule } from '../shared.module';
import { DebugModule } from '../debug/debug.module';

@NgModule({
  imports: [SharedModule, DebugModule],
  declarations: [DefaultItemListComponent],
  exports: [DefaultItemListComponent]
})
export class ItemListModule {}
