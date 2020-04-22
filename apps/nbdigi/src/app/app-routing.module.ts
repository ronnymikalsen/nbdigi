import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full', canActivate: [AuthGuard] },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'explore',
    loadChildren: () => import('./explore/explore.module').then(m => m.ExploreModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'search',
    loadChildren: () => import('./search/search.module').then(m => m.SearchModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'mylibrary',
    loadChildren: () => import('./my-library/my-library.module').then(m => m.MyLibraryModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'myactivity',
    loadChildren: () => import('./my-activity/my-activity.module').then(m => m.MyActivityModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
