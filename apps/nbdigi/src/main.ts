import { provideZoneChangeDetection } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded');

  platformBrowserDynamic()
    .bootstrapModule(AppModule, {
      applicationProviders: [provideZoneChangeDetection()],
    })
    .catch((err) => console.error(err));
});
