import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { MyLibraryRoutingModule } from './my-library-routing.module';
import { MyLibraryComponent } from './components/my-library/my-library.component';
import { FavoriteButtonComponent } from './containers/favorite-button/favorite-button.component';
import { AddToFavoriteListDialogComponent } from './containers/add-to-favorite-list-dialog/add-to-favorite-list-dialog.component';
import { MyLibraryPageComponent } from './containers/my-library-page';

@NgModule({
  imports: [SharedModule, MyLibraryRoutingModule, FormsModule],
  declarations: [
    MyLibraryPageComponent,
    MyLibraryComponent,
    FavoriteButtonComponent,
    AddToFavoriteListDialogComponent
  ],
  providers: [],
  entryComponents: [AddToFavoriteListDialogComponent],
  exports: [FavoriteButtonComponent]
})
export class MyLibraryModule {}
