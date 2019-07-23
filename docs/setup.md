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

For more configuration options, view the full list of [webpack options](webpack-options).

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

## Debugging

> Note: This can be automated via our [Babel plugin](#babel-setup).

All styling APIs (except for `globalStyle`) have an optional argument that allows you to provide a local debug name.

For example, the local name for the following style will be `style` by default because treat doesn't have access to your variable name at runtime.

<!-- prettier-ignore -->
```js
export const green = style({ color: 'green' });
```

To fix this, you can pass in a debug name as the last argument:

<!-- prettier-ignore -->
```js
export const green = style({ color: 'green' }, 'green');
```

## Server side rendering

SSR apps will likely be running two webpack builds (one targetting the browser, and one for node). The server config should disable CSS output by passing "`outputCSS: false`".

```js
const TreatPlugin = require('treat/webpack-plugin');

module.exports = {
  plugins: [
    new TreatPlugin({
      outputCSS: false
    })
  ]
};
```

## Bundle splitting

`treat` supports bundle splitting via [webpack dynamic imports](https://webpack.js.org/guides/code-splitting/#dynamic-imports) with no special setup. It's likely you'll want to split your themes into separate CSS files. This is achieved by dynamic importing your treat files that call [`createTheme`](styling-api#createtheme).

```js
// mainTheme.treat.js

import { createTheme } from 'treat';

export default createTheme({
  // theme stuff
});
```

```js
import { resolveStyles } from 'treat';
import styleRefs from './styles.treat';

import(`./${theme}.treat`).then(theme => {
  const styles = resolveStyles(theme.default, styleRefs);

  // Style away
});
```
