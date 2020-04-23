const TreatPlugin = require('treat/webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

exports.onCreateBabelConfig = ({ actions }) => {
  actions.setBabelPlugin({
    name: 'babel-plugin-treat',
  });
};

exports.onCreateWebpackConfig = (
  { stage, actions },
  { plugins, ...pluginOptions },
) => {
  if (stage === 'develop-html') return;

  const defaultPluginOptions =
    stage === 'develop'
      ? {
          localIdentName: '[name]-[local]_[hash:base64:5]',
          themeIdentName: '_[name]-[local]_[hash:base64:4]',
        }
      : {
          localIdentName: '[hash:base64:5]',
          themeIdentName: '[hash:base64:4]',
        };

  if (stage === 'build-javascript') {
    pluginOptions.outputLoaders = [MiniCssExtractPlugin.loader];
  } else if (stage === 'build-html') {
    pluginOptions.outputCSS = false;
  }

  actions.setWebpackConfig({
    plugins: [
      new TreatPlugin({
        ...defaultPluginOptions,
        ...pluginOptions,
      }),
    ],
  });
};
