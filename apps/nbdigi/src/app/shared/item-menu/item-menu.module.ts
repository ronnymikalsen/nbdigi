import { NgModule } from '@angular/core';
import { RemoveWarningDialogComponent } from '../../my-library/components/remove-warning-dialog/remove-warning-dialog.component';
import { SharedModule } from '../shared.module';
import { ItemMenuButtonComponent } from './item-menu-button/item-menu-button.component';

@NgModule({
  imports: [SharedModule],
  declarations: [ItemMenuButtonComponent, RemoveWarningDialogComponent],
  exports: [ItemMenuButtonComponent],
})
export class ItemMenuModule {}
