import { ItemsSectionModule } from './../items-section/items-section.module';
import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';
import { HomePageComponent } from './containers/home-page';
import { HomeComponent } from './components/home/home.component';
import { SearchBoxModule } from '../search-box/search-box.module';

@NgModule({
  imports: [
    SharedModule,
    HomeRoutingModule,
    SearchBoxModule,
    ItemsSectionModule
  ],
  declarations: [HomePageComponent, HomeComponent],
  providers: []
})
export class HomeModule {}
