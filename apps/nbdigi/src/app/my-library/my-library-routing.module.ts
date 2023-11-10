import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MyLibraryPageComponent } from './containers/my-library-page';
import { FavoriteListPageComponent } from './containers/favorite-list-page/favorite-list-page';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: MyLibraryPageComponent },
      { path: ':id', component: FavoriteListPageComponent },
    ]),
  ],
  exports: [RouterModule],
})
export class MyLibraryRoutingModule {}
