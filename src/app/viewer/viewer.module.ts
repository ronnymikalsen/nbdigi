import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AddToFavoriteListDialogComponent } from '../my-library/containers/add-to-favorite-list-dialog/add-to-favorite-list-dialog.component';
import { MyLibraryModule } from '../my-library/my-library.module';
import { SharedModule } from '../shared/shared.module';
import { ViewerComponent } from './components/viewer/viewer.component';
import { ViewerPageComponent } from './containers/viewer-page';
import { ItemMenuModule } from '../item-menu/item-menu.module';

@NgModule({
  imports: [CommonModule, SharedModule, MyLibraryModule, ItemMenuModule],
  declarations: [ViewerPageComponent, ViewerComponent],
  entryComponents: [ViewerPageComponent]
})
export class ViewerModule {}
