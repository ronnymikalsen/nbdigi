import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DefaultItemCardComponent } from './containers/default-item-card/default-item-card.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [SharedModule],
  declarations: [DefaultItemCardComponent],
  exports: [DefaultItemCardComponent]
})
export class ItemCardModule {}
