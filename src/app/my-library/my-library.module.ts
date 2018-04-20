import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { MyLibraryRoutingModule } from './my-library-routing.module';
import { MyLibraryComponent } from './components/my-library/my-library.component';
import { AddToFavoriteListDialogComponent } from './containers/add-to-favorite-list-dialog/add-to-favorite-list-dialog.component';
import { MyLibraryPageComponent } from './containers/my-library-page';
import { CreateFavoriteListComponent } from './components/create-favorite-list/create-favorite-list.component';
import { FavoriteListPageComponent } from './containers/favorite-list-page/favorite-list-page';
import { FavoriteListComponent } from './components/favorite-list/favorite-list.component';
import { ItemsSectionModule } from '../items-section/items-section.module';

@NgModule({
  imports: [
    SharedModule,
    MyLibraryRoutingModule,
    FormsModule,
    ItemsSectionModule
  ],
  declarations: [
    MyLibraryPageComponent,
    MyLibraryComponent,
    AddToFavoriteListDialogComponent,
    CreateFavoriteListComponent,
    FavoriteListPageComponent,
    FavoriteListComponent
  ],
  providers: [],
  entryComponents: [AddToFavoriteListDialogComponent],
  exports: [AddToFavoriteListDialogComponent, CreateFavoriteListComponent]
})
export class MyLibraryModule {}
