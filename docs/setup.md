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
$ yarn add --dev babel-plugin-treat
```

Then, add it to your Babel config. For example, in `.babelrc`:

```js
{
  "plugins": ["babel-plugin-treat"]
}
```

## Debugging

> Note: This can be automated via our [Babel plugin](#babel-setup).

All styling APIs (except for [`globalStyle`](styling-api#globalstyle)) have an optional argument that allows you to provide a local debug name.

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

Server-rendered apps will likely be running two webpack builds (one for the browser code, and one for the server code). The server config should disable CSS output by setting `outputCSS` to `false`.

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

If you'd like to dynamically load themes, treat supports bundle splitting via [webpack dynamic imports](https://webpack.js.org/guides/code-splitting/#dynamic-imports) with no special setup.

In practice, it's likely you'll want to split your themes into separate CSS files. This is achieved by dynamic importing your treat files that call [`createTheme`](styling-api#createtheme).

Let's assume you have a set of theme files that look like this:

```js
// mainTheme.treat.js
import { createTheme } from 'treat';

export default createTheme({
  // Theme variables...
});
```

You can then dynamically load the desired theme and use it to resolve styles.

```js
import { resolveStyles } from 'treat';
import styleRefs from './styles.treat';

// Inject the theme name somehow:
const themeName = getThemeName();

import(`../themes/${themeName}.treat`).then(theme => {
  const styles = resolveStyles(theme.default, styleRefs);
  // You now have access to themed styles!
});
```

If you're using the [React API](react-api), you'll want to provide the theme to your [`TreatProvider`](react-api#treatprovider).

## Gatsby Setup

To use `treat` in a `gatsby` project, install `gatsby-plugin-treat` and add it to your `gatsby-config.js` file like this:

```js
module.exports = {
  plugins: [`gatsby-plugin-treat`]
};
```

Additionally, the naming convention for CSS classes and themes can be overrided:

```js
module.exports = {
  plugins: [
    {
      resolve: `gatsby-plugin-treat`,
      options: {
        // Useful for atomic styles with filename-independent class names
        localIdentName:
          process.env.NODE_ENV !== `production`
            ? `[local]_[hash:base64:5]`
            : `[hash:base64:5]`,

        // Useful when only a single theme is applied
        themeIdentName: ``
      }
    }
  ]
};
```
