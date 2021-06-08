module.exports = {
  preset: '../../jest.preset.js',
  coverageDirectory: '../../coverage/apps/nbdigi/',
  setupFilesAfterEnv: ['<rootDir>src/test-setup.ts'],
  globals: {
    'ts-jest': {
      stringifyContentPathRegex: '\\.(html|svg)$',
      astTransformers: [
        'jest-preset-angular/build/InlineFilesTransformer',
        'jest-preset-angular/build/StripStylesTransformer',
      ],
      tsconfig: '<rootDir>tsconfig.spec.json',
    },
  },
  displayName: 'nbdigi',
};
