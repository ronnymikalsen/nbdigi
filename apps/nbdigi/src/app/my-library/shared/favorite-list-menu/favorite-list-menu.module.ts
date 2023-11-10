import { NgModule } from '@angular/core';
import { MaterialModule } from '../../../shared/material.module';
import { SharedModule } from '../../../shared/shared.module';
import { FavoriteListMenuButtonComponent } from './favorite-list-menu-button/favorite-list-menu-button.component';

@NgModule({
  imports: [SharedModule, MaterialModule],
  declarations: [FavoriteListMenuButtonComponent],
  exports: [FavoriteListMenuButtonComponent],
})
export class FavoriteListMenuModule {}
