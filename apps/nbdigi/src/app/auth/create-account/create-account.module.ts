import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CreateAccountComponent } from './components/create-account/create-account.component';
import { CreateAccountPageComponent } from './containers/create-account-page';
import { CreateAccountRoutingModule } from './create-account-routing.module';

@NgModule({
  imports: [SharedModule, CreateAccountRoutingModule],
  declarations: [CreateAccountPageComponent, CreateAccountComponent],
  providers: []
})
export class CreateAccountModule {}
