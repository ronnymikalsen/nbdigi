import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AddToFavoriteListDialogComponent } from '../my-library/containers/add-to-favorite-list-dialog/add-to-favorite-list-dialog.component';
import { MyLibraryModule } from '../my-library/my-library.module';
import { SharedModule } from '../shared/shared.module';
import { ViewerComponent } from './components/viewer/viewer.component';
import { ViewerPageComponent } from './containers/viewer-page';

@NgModule({
  imports: [CommonModule, SharedModule, MyLibraryModule],
  declarations: [ViewerPageComponent, ViewerComponent],
  entryComponents: [ViewerPageComponent]
})
export class ViewerModule {}
