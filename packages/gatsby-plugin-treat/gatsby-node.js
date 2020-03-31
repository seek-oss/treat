const TreatPlugin = require('treat/webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

exports.onCreateBabelConfig = ({ stage, actions }) => {
  actions.setBabelPlugin({
    name: `babel-plugin-treat`,
  });
};

exports.onCreateWebpackConfig = ({ stage, actions }, pluginOptions) => {
  if (stage === `develop-html`) return;

  const defaultPluginOptions =
    stage === `develop`
      ? {
          localIdentName: '[name]-[local]_[hash:base64:5]',
          themeIdentName: '_[name]-[local]_[hash:base64:4]',
        }
      : {
          localIdentName: '[hash:base64:5]',
          themeIdentName: '[hash:base64:4]',
        };
  pluginOptions = {
    ...defaultPluginOptions,
    ...pluginOptions,
  };

  // Only the properties destructured below should be overridable from outside
  const { localIdentName, themeIdentName } = pluginOptions;
  pluginOptions = { localIdentName, themeIdentName };

  if (stage === `build-javascript`) {
    pluginOptions.outputLoaders = [MiniCssExtractPlugin.loader];
  } else if (stage === `build-html`) {
    pluginOptions.outputCSS = false;
  }

  actions.setWebpackConfig({ plugins: [new TreatPlugin(pluginOptions)] });
};
