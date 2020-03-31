const TreatPlugin = require('treat/webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

exports.onCreateBabelConfig = ({ stage, actions }) => {
  actions.setBabelPlugin({
    name: `babel-plugin-treat`,
  });
};

exports.onCreateWebpackConfig = ({ stage, actions }) => {
  if (stage === `develop-html`) return;

  const identNameConfig =
    stage === `develop`
      ? {
          localIdentName: '[name]-[local]_[hash:base64:5]',
          themeIdentName: '_[name]-[local]_[hash:base64:4]',
        }
      : {
          localIdentName: '[hash:base64:5]',
          themeIdentName: '[hash:base64:4]',
        };

  let pluginOptions;

  switch (stage) {
    case `develop`:
      pluginOptions = identNameConfig;
      break;

    case `build-javascript`:
      pluginOptions = {
        ...identNameConfig,
        outputLoaders: [MiniCssExtractPlugin.loader],
      };
      break;

    case `build-html`:
      pluginOptions = {
        ...identNameConfig,
        outputCSS: false,
      };
      break;
  }

  actions.setWebpackConfig({ plugins: [new TreatPlugin(pluginOptions)] });
};
