const TreatPlugin = require('treat/webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

exports.onCreateBabelConfig = ({stage, actions}) => {
  actions.setBabelPlugin({
    name: `babel-plugin-treat`,
  });
}

exports.onCreateWebpackConfig = ({stage, actions}) => {
  let config = {};

  const identNameConfig =
    stage === `develop` || stage === `develop-html`
      ? {
          localIdentName: '[name]-[local]_[hash:base64:5]',
          themeIdentName: '_[name]-[local]_[hash:base64:4]',
        }
      : {
          localIdentName: '[hash:base64:5]',
          themeIdentName: '[hash:base64:4]',
        };

  switch (stage) {
    case `develop`:
      config = {
        plugins: [
          new TreatPlugin({
            ...identNameConfig
          }),
        ]
      };
      break;

    case `develop-html`:
      break;  
    
    case `build-javascript`:
      config = {
        plugins: [
          new TreatPlugin({
            ...identNameConfig,
            outputLoaders: [MiniCssExtractPlugin.loader]
          })
        ]
      };
      break;

    case `build-html`:
      config = {
        plugins: [
          new TreatPlugin({
            ...identNameConfig,
            outputCSS: false
          }),
        ]
      };
      break;

  }

  actions.setWebpackConfig(config);
 }
