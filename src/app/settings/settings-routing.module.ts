import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SettingsPageComponent } from './containers/settings-page';

@NgModule({
  imports: [
    RouterModule.forChild([{ path: '', component: SettingsPageComponent }])
  ],
  exports: [RouterModule]
})
export class SettingsRoutingModule {}
