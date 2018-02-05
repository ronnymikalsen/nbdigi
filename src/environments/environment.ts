// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  nb: {
    apiURL: 'https://api.nb.no'
  },
  firebase: {
    apiKey: 'AIzaSyCVG1WAE5GFtWF-3-oiIfz_8hWFw-R5QhM',
    authDomain: 'nbdigi.com',
    databaseURL: 'https://nbdigi-9637d.firebaseio.com',
    projectId: 'nbdigi-9637d',
    storageBucket: 'nbdigi-9637d.appspot.com',
    messagingSenderId: '465687493405'
  }
};
