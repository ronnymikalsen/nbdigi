import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';
import { HomePageComponent } from './containers/home-page';
import { HomeComponent } from './components/home/home.component';
import { ItemCardModule } from '../item-card/item-card.module';
import { SearchBoxModule } from '../search-box/search-box.module';

@NgModule({
  imports: [SharedModule, HomeRoutingModule, ItemCardModule, SearchBoxModule],
  declarations: [HomePageComponent, HomeComponent],
  providers: []
})
export class HomeModule {}
