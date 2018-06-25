import { NgModule } from '@angular/core';
import { SearchBoxModule } from '../shared/search-box/search-box.module';
import { SharedModule } from '../shared/shared.module';
import { ItemsSectionModule } from './../shared/items-section/items-section.module';
import { HomeComponent } from './components/home/home.component';
import { HomePageComponent } from './containers/home-page';
import { HomeRoutingModule } from './home-routing.module';

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
