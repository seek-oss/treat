---
title: Webpack Options
---

# Webpack Options

The following options can be supplied to the included webpack plugin, e.g.

```js
const TreatPlugin = require('treat/webpack-plugin');

module.exports = {
  plugins: [
    new TreatPlugin({
      // Plugin options go here...
    })
  ]
};
```

All configuration values are optional.

Some configuration defaults differ between production and development environments. This is inferred from your [webpack mode](https://webpack.js.org/concepts/#mode) setting.

<!-- prettier-ignore-start -->
## outputLoaders
_Default: `['style-loader']`_<br />
_Type: [Array of webpack loader configurations](https://webpack.js.org/configuration/module/#useentry)_

Defines which loaders generated CSS should be passed through after `css-loader`. Strings (e.g. `style-loader`) and objects with options are supported.<br />

## test
_Default: `/\.treat.(js\|ts)$/`_<br />
_Type: [Webpack condition](https://webpack.js.org/configuration/module/#rule-conditions)_

Configures which files are considered to be treat files.

## localIdentName
_Default (Production): `'[hash:base64:5]'`_<br />
_Default (Development): `'[name]-[local]\_[hash:base64:5]'`_<br />
_Type: `'string'`_

Template string for naming CSS classes. Should always contain a `hash` option to avoid clashes.

## themeIdentName
_Default (Production): `'[hash:base64:4]'`_<br />
_Default (Development): `'\_[name]-[local]\_[hash:base64:4]'`_<br />
_Type: `string`_

Same as `localIdentName`, but for themes. Useful for debugging which classes belong to which theme. Can also be a function that receives your theme, which is useful for minifying theme classes, e.g. `theme => themeNames.indexOf(theme.name)`.

## minify
_Default (Production): `true`_<br />
_Default (Development): `false`_<br />
_Type: `boolean`_

Configures whether to minify the generated CSS.

## browsers
_Default: [Browserslist config](https://github.com/browserslist/browserslist#config-file), if present._<br />
_Type: [Browserslist query](https://github.com/browserslist/browserslist)_

Configures which browsers to target when running generated CSS through [autoprefixer](https://github.com/postcss/autoprefixer).

## outputCSS
_Default: `true`_<br />
_Type: `boolean`_

Configures whether to output CSS in the resulting bundle. Useful for server rendered apps that have separate webpack builds for client and server code, only one of which needs to generate styles.

## hmr
_Default: `false`_<br />
_Type: `boolean`_

> Requires at least webpack v4.43.0

Enable hot module reloading for treat modules. 

**Note:** This only enables HMR for the generated JavaScript. As treat forwards CSS to your `outputLoaders` (e.g. MiniCssExtractPlugin) you'll need to refer to their docs for how to set up HMR for your CSS.

```js
// Example setup for MiniCSSExtractPlugin
module.exports = {
  plugins: [
    new TreatPlugin({
      hmr: process.env.NODE_ENV === 'development',
      outputLoaders: [{
        loader: MiniCssExtractPlugin.loader,
        options: {
          hmr: process.env.NODE_ENV === 'development',
          reloadAll: true, // Required for treat HMR to work
        },
      }]
    }),
    new MiniCssExtractPlugin()
  ]
};
```

<!-- prettier-ignore-end -->
