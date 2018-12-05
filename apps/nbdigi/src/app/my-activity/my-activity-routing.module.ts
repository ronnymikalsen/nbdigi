import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core/guards';
import { MyActivityPageComponent } from './containers/my-activity-page';

const routes: Routes = [
  { path: '', component: MyActivityPageComponent },
  {
    path: 'settings',
    loadChildren: './settings/settings.module#SettingsModule',
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyActivityRoutingModule {}
