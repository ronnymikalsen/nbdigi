import { NgModule } from '@angular/core';
import { UiMaterialModule } from '@nbdigi/ui-material';
import { SharedModule } from '../shared.module';
import { FavoriteListMenuButtonComponent } from './favorite-list-menu-button/favorite-list-menu-button.component';

@NgModule({
  imports: [SharedModule, UiMaterialModule],
  declarations: [FavoriteListMenuButtonComponent],
  exports: [FavoriteListMenuButtonComponent]
})
export class FavoriteListMenuModule {}
