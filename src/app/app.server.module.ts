import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';

import { AppModule } from './app.module';
import { SharedModule } from './shared/shared.module';
import { AppComponent } from './app.component';
import { Routes, RouterModule } from '@angular/router';
import { AppShellComponent } from './app-shell/app-shell.component';

const routes: Routes = [{ path: 'app-shell-path', component: AppShellComponent }];

declare var global: any;
(global as any).XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

@NgModule({
  imports: [AppModule, ServerModule, RouterModule.forRoot(routes), SharedModule],
  bootstrap: [AppComponent],
  declarations: [AppShellComponent]
})
export class AppServerModule {}
