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
  const isDev = stage.includes('develop');
  const defaultPluginOptions = isDev
    ? {
        localIdentName: '[name]-[local]_[hash:base64:5]',
        themeIdentName: '_[name]-[local]_[hash:base64:4]',
      }
    : {
        localIdentName: '[hash:base64:5]',
        themeIdentName: '[hash:base64:4]',
      };

  actions.setWebpackConfig({
    plugins: [
      new TreatPlugin({
        ...defaultPluginOptions,
        ...pluginOptions,
        outputCSS: !isSSR,
        outputLoaders: !isDev
          ? [
              // Logic adopted from https://github.com/gatsbyjs/gatsby/blob/7bc6af46e5bd4cdde76be3fa4a857e00fc2e4635/packages/gatsby/src/utils/webpack-utils.ts#L185-L193
              MiniCssExtractPlugin.loader,
            ]
          : undefined,
      }),
    ],
  });
};
