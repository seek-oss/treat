const seekBrowserslist = require('browserslist-config-seek');

module.exports = {
  presets: [
    '@babel/preset-typescript',
    '@babel/preset-react',
    ['@babel/preset-env', { targets: seekBrowserslist }],
  ],
};
