import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HomePageComponent } from './containers/home-page';

@NgModule({
  imports: [
    RouterModule.forChild([{ path: '', component: HomePageComponent }]),
  ],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
