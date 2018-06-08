import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemMenuButtonComponent } from './item-menu-button/item-menu-button.component';
import { SharedModule } from '../shared/shared.module';
import { RemoveWarningDialogComponent } from './remove-warning-dialog/remove-warning-dialog.component';

@NgModule({
  imports: [SharedModule],
  declarations: [ItemMenuButtonComponent, RemoveWarningDialogComponent],
  entryComponents: [RemoveWarningDialogComponent],
  exports: [ItemMenuButtonComponent]
})
export class ItemMenuModule {}
