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

  const isSSR = stage.includes('html');
  actions.setWebpackConfig({
    plugins: [
      new TreatPlugin({
        ...pluginOptions,
        outputCSS: !isSSR,
        outputLoaders: [
          // Logic adopted from https://github.com/gatsbyjs/gatsby/blob/73eb53b18a2e8e7cf451312d74f6c07ed3bf35bc/packages/gatsby/src/utils/webpack-utils.ts#L185-L193
          !isSSR ? MiniCssExtractPlugin.loader : 'style-loader',
        ],
      }),
    ],
  });
};
