const { nxPreset } = require('@nx/jest/preset');
const { createCjsPreset } = require('jest-preset-angular/presets');

module.exports = {
  ...nxPreset,
  ...createCjsPreset(),
  testMatch: ['**/+(*.)+(spec|test).+(ts|js)?(x)'],
  resolver: '@nx/jest/plugins/resolver',
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageReporters: ['html'],
};
