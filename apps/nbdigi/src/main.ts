import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded');

  platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .then(() => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/ngsw-worker.js');
      }
    })
    .catch((err) => console.error(err));
});
