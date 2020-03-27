const TreatPlugin = require('treat/webpack-plugin');

module.exports = (pluginOptions = {}) => (nextConfig = {}) => {
  return Object.assign({}, nextConfig, {
    webpack(config, options) {
      config.plugins.push(
        new TreatPlugin(
          Object.assign({}, pluginOptions, {
            outputCSS: !options.isServer,
          }),
        ),
      );

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options);
      }

      return config;
    },
  });
};
