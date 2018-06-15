import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MyLibraryModule } from '../my-library/my-library.module';
import { ItemMenuModule } from '../shared/item-menu/item-menu.module';
import { SharedModule } from '../shared/shared.module';
import { ViewerComponent } from './components/viewer/viewer.component';
import { ViewerPageComponent } from './containers/viewer-page';

@NgModule({
  imports: [CommonModule, SharedModule, MyLibraryModule, ItemMenuModule],
  declarations: [ViewerPageComponent, ViewerComponent],
  entryComponents: [ViewerPageComponent]
})
export class ViewerModule {}
