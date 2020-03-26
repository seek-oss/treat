const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TreatPlugin = require('treat/webpack-plugin');

module.exports = (pluginOptions = {}) => (nextConfig = {}) => {
  return Object.assign({}, nextConfig, {
    webpack(config, { isServer }) {
      config.plugins.push(
        new TreatPlugin(
          Object.assign({}, pluginOptions, {
            outputLoaders: [MiniCssExtractPlugin.loader],
            outputCSS: !isServer,
          }),
        ),
        new MiniCssExtractPlugin(),
      );
      return config;
    },
  });
};
