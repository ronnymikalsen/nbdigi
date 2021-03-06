import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ItemDetailsModule } from '../shared/item-details/item-details.module';
import { ItemsSectionModule } from '../shared/items-section/items-section.module';
import { SharedModule } from '../shared/shared.module';
import { CreateFavoriteListComponent } from './components/create-favorite-list/create-favorite-list.component';
import { FavoriteListComponent } from './components/favorite-list/favorite-list.component';
import { AddToFavoriteListDialogComponent } from './containers/add-to-favorite-list-dialog/add-to-favorite-list-dialog.component';
import { FavoriteListPageComponent } from './containers/favorite-list-page/favorite-list-page';
import { MyLibraryPageComponent } from './containers/my-library-page';
import { MyLibraryComponent } from './containers/my-library/my-library.component';
import { MyLibraryRoutingModule } from './my-library-routing.module';
import { RemoveFavoriteDialogComponent } from './shared/favorite-list-menu/favorite-list-menu-button/remove-favorite-dialog/remove-favorite-dialog.component';
import { RenameFavoriteDialogComponent } from './shared/favorite-list-menu/favorite-list-menu-button/rename-favorite-dialog/rename-favorite-dialog.component';
import { FavoriteListMenuModule } from './shared/favorite-list-menu/favorite-list-menu.module';

@NgModule({
  imports: [
    SharedModule,
    MyLibraryRoutingModule,
    FormsModule,
    ItemsSectionModule,
    FavoriteListMenuModule,
    ItemDetailsModule
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
  exports: [AddToFavoriteListDialogComponent, CreateFavoriteListComponent]
})
export class MyLibraryModule {}
