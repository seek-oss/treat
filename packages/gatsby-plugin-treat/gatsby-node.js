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

  if (stage === 'build-javascript') {
    pluginOptions.outputLoaders = [MiniCssExtractPlugin.loader];
  } else if (stage === 'build-html') {
    pluginOptions.outputCSS = false;
  }

  actions.setWebpackConfig({
    plugins: [
      new TreatPlugin({
        ...pluginOptions,
      }),
    ],
  });
};
