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

  actions.setWebpackConfig({
    plugins: [
      new TreatPlugin({
        ...pluginOptions,
        outputCSS: stage !== 'build-html',
        outputLoaders:
          stage === 'build-javascript'
            ? [MiniCssExtractPlugin.loader]
            : ['style-loader'],
      }),
    ],
  });
};
