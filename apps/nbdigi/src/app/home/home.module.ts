import { NgModule } from '@angular/core';
import { ItemDetailsModule } from '../shared/item-details/item-details.module';
import { ItemsSectionModule } from '../shared/items-section/items-section.module';
import { SearchBoxModule } from '../shared/search-box/search-box.module';
import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './components/home/home.component';
import { HomePageComponent } from './containers/home-page';
import { HomeRoutingModule } from './home-routing.module';

@NgModule({
  imports: [
    SharedModule,
    HomeRoutingModule,
    SearchBoxModule,
    ItemsSectionModule,
    ItemDetailsModule,
  ],
  declarations: [HomePageComponent, HomeComponent],
  providers: [],
})
export class HomeModule {}
