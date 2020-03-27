const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TreatPlugin = require('treat/webpack-plugin');

module.exports = (pluginOptions = {}) => (nextConfig = {}) => {
  return Object.assign({}, nextConfig, {
    webpack(config, options) {
      config.plugins.push(
        new TreatPlugin(
          Object.assign(
            {},
            pluginOptions,
            { outputCSS: !options.isServer },
            // Extract static CSS in production
            // Logic adopted from https://github.com/zeit/next.js/blob/a81d7620a40b2006cb6726236402fc3f82f65ab8/packages/next/build/webpack/config/blocks/css/index.ts#L298-L320
            !options.dev &&
              !options.isServer && {
                outputLoaders: [MiniCssExtractPlugin.loader],
              },
          ),
        ),
      );

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options);
      }

      return config;
    },
  });
};
