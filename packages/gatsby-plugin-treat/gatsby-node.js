const TreatPlugin = require('treat/webpack-plugin').default;

exports.onCreateBabelConfig = ({ actions }) => {
  actions.setBabelPlugin({
    name: 'babel-plugin-treat',
  });
};

exports.onCreateWebpackConfig = (
  { stage, loaders, actions },
  { plugins, ...pluginOptions },
) => {
  if (stage === 'develop-html') return;

  const defaultPluginOptions = stage.includes('develop')
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
        outputCSS: !stage.includes('html'),
        outputLoaders: [loaders.miniCssExtract()],
      }),
    ],
  });
};
