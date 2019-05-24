---
title: Setup
---

# Setup

## Webpack Setup

To get started, add the treat [webpack](https://webpack.js.org/) plugin to [`webpack.config.js`](https://webpack.js.org/concepts/configuration). Since webpack is required to use treat, the webpack plugin is provided via the core `treat` package as `treat/webpack-plugin`.

```js
const TreatPlugin = require('treat/webpack-plugin');

module.exports = {
  plugins: [new TreatPlugin()]
};
```

By default, this will inject styles into the page via [style-loader](https://github.com/webpack-contrib/style-loader), but this can be overridden via the `outputLoaders` option.

For example, if you'd like to **export static CSS files,** you can wire it up to [mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin).

```js
const TreatPlugin = require('treat/webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  plugins: [
    new TreatPlugin({
      outputLoaders: [MiniCssExtractPlugin.loader]
    }),
    new MiniCssExtractPlugin()
  ]
};
```

For more configuration options, view the full [webpack plugin API](#webpack-plugin-api).

## Babel Setup

In order to improve the [debugging](#debugging) experience, treat also provides an optional Babel plugin.

First, install the plugin:

```bash
$ yarn add --dev babel-plugin-treat@next
```

Then, add it to your Babel config. For example, in `.babelrc`:

```js
{
  "plugins": ["babel-plugin-treat"]
}
```
