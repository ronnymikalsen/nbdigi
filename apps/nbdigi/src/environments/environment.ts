// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  nb: {
    apiURL: 'https://api.nb.no',
  },
  ai: {
    model: 'gemini-3.1-flash-lite',
    thinkingLevel: 'MINIMAL',
    appCheckSiteKey: '6LcUbQguAAAAAGGevV20JseHKtn4C_qlAexOaG60',
  },
  firebase: {
    apiKey: 'AIzaSyDQkQ2AgSczMKQ8fJZguaQxQ9iPLBGZoDw',
    authDomain: 'nbdigi-9637d.firebaseapp.com',
    databaseURL: 'https://nbdigi-9637d.firebaseio.com',
    projectId: 'nbdigi-9637d',
    storageBucket: 'nbdigi-9637d.appspot.com',
    messagingSenderId: '465687493405',
    appId: '1:465687493405:web:9aac50cb2ee65559567ff4',
  },
};
