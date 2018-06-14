import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ItemsSectionModule } from '../items-section/items-section.module';
import { SharedModule } from '../shared/shared.module';
import { CreateFavoriteListComponent } from './components/create-favorite-list/create-favorite-list.component';
import { FavoriteListComponent } from './components/favorite-list/favorite-list.component';
import { MyLibraryComponent } from './components/my-library/my-library.component';
import { RemoveFavoriteDialogComponent } from './components/remove-favorite-dialog/remove-favorite-dialog.component';
import { RenameFavoriteDialogComponent } from './components/rename-favorite-dialog/rename-favorite-dialog.component';
import { AddToFavoriteListDialogComponent } from './containers/add-to-favorite-list-dialog/add-to-favorite-list-dialog.component';
import { FavoriteListPageComponent } from './containers/favorite-list-page/favorite-list-page';
import { MyLibraryPageComponent } from './containers/my-library-page';
import { MyLibraryRoutingModule } from './my-library-routing.module';
import { FavoriteListMenuModule } from './shared/favorite-list-menu/favorite-list-menu.module';

@NgModule({
  imports: [
    SharedModule,
    MyLibraryRoutingModule,
    FormsModule,
    ItemsSectionModule,
    FavoriteListMenuModule
  ],
  declarations: [
    MyLibraryPageComponent,
    MyLibraryComponent,
    AddToFavoriteListDialogComponent,
    CreateFavoriteListComponent,
    FavoriteListPageComponent,
    FavoriteListComponent,
    RenameFavoriteDialogComponent,
    RemoveFavoriteDialogComponent
  ],
  providers: [],
  entryComponents: [
    AddToFavoriteListDialogComponent,
    RenameFavoriteDialogComponent,
    RemoveFavoriteDialogComponent
  ],
  exports: [AddToFavoriteListDialogComponent, CreateFavoriteListComponent]
})
export class MyLibraryModule {}
