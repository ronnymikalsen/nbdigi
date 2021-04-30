import * as webpack from 'webpack';

const webpackConfig: webpack.Configuration = {
  module: {
    rules: [
      // add custom rules here
    ],
  },
  plugins: [new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /nb/)],
};

module.exports = webpackConfig;
