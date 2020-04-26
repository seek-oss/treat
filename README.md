<div align="center" >
  <img src="./logo.png" alt="treat" width="160px" />
  <br />
  <br />
  Themeable, statically extracted CSS&#8209;in&#8209;JS with near&#8209;zero runtime.
  <br />
  <br />

[![Build Status](https://img.shields.io/travis/seek-oss/treat/master.svg?logo=travis&style=flat-square)](http://travis-ci.org/seek-oss/treat) [![treat](https://img.shields.io/npm/v/treat.svg?label=treat&logo=npm&style=flat-square)](https://www.npmjs.com/package/treat) [![Spectrum Community](https://img.shields.io/badge/community-spectrum-a36ae4.svg?style=flat-square)](https://spectrum.chat/treatcss)

  <br />
  <br />
</div>


Write your styles in JavaScript/TypeScript within **treat files** (e.g. `Button.treat.js`) that get executed at build time.

All CSS rules are created ahead of time, so the runtime is _very_ lightweight—only needing to swap out pre-existing classes. In fact, if your application doesn’t use theming, you don’t even need the runtime at all.

**All CSS logic, including its dependencies, will not be included in your final bundle.**

_**Because theming is achieved by generating multiple classes, legacy browsers are supported.**_

<br />

## [Documentation](https://seek-oss.github.io/treat)

See the documentation at [seek-oss.github.io/treat](https://seek-oss.github.io/treat) for more information about using treat.

<br />

## Requirements

Your project must be using [webpack](https://seek-oss.github.io/treat/webpack-options) with the supplied [webpack plugin](https://seek-oss.github.io/treat/webpack-options), but that’s it.

**First-class support is provided for [React](https://reactjs.org/) and [TypeScript](https://www.typescriptlang.org/)**, but those layers are _entirely optional_. The core [runtime API](https://seek-oss.github.io/treat/runtime-api) can be integrated into other frameworks, if needed.

The runtime makes use of [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map), so you may need a [polyfill](https://www.npmjs.com/package/es6-map) for [pre-ES2015 browsers](https://caniuse.com/#feat=es6).

## Basic usage

First, install the core libary.

```sh
$ yarn add treat
```

Then, add the [webpack plugin](https://seek-oss.github.io/treat/setup#webpack-setup) to your project. In this case, we’re using [mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin) to generate a static CSS file.

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

Next, define and export [styles](https://seek-oss.github.io/treat/data-types#styles) from a treat file.

```js
// Button.treat.js
// ** THIS CODE WON'T END UP IN YOUR BUNDLE! **
import { style } from 'treat';

export const button = style({
  backgroundColor: 'blue',
  height: 48
});
```

Finally, import the styles.

```jsx
// Button.js
import * as styles from './Button.treat.js';

export const Button = ({ text }) => `
  <button className="${styles.button}">${text}</button>
`;
```

## Themed usage

>This themed usage example makes use of [react-treat](https://seek-oss.github.io/treat/react-api) to keep things simple. React is [not required](https://seek-oss.github.io/treat/runtime-api) to use treat.

First, install react-treat.

```sh
$ yarn add react-treat
```

Assuming you’ve already set up the [webpack plugin](https://seek-oss.github.io/treat/setup#webpack-setup), start by creating and exporting a theme from a treat file. Normally, you’d define multiple themes, but let’s keep it short.

```js
// theme.treat.js
// ** THIS CODE WON'T END UP IN YOUR BUNDLE! **
import { createTheme } from 'treat';

export default createTheme({
  brandColor: 'blue',
  grid: 4
});
```

Then, import the desired theme and pass it to [`TreatProvider`](https://seek-oss.github.io/treat/react-api#treatprovider) at the root of your application.

```jsx
// App.js
import React from 'react';
import { TreatProvider } from 'react-treat';

import theme from './theme.treat.js';

export const App = () => (
  <TreatProvider theme={theme}>...</TreatProvider>
);
```

Now that you’ve configured the theming system, define and export [themed styles](https://seek-oss.github.io/treat/data-types#themedstyles) from a treat file.

```js
// Button.treat.js
// ** THIS CODE WON'T END UP IN YOUR BUNDLE EITHER! **
import { style } from 'treat';

export const button = style(theme => ({
  backgroundColor: theme.brandColor,
  height: theme.grid * 11
}));
```

> Themed styles have higher precedence than non-themed styles, regardless of document order. For more information, read the [theming](https://seek-oss.github.io/treat/how-it-works#theming) guide.

Then import and resolve themed styles via the [`useStyles` Hook](https://seek-oss.github.io/treat//react-api#usestyles).

```jsx
// Button.js
import React from 'react';
import { useStyles } from 'react-treat';
import * as styleRefs from './Button.treat.js';

export const Button = props => {
  const styles = useStyles(styleRefs);

  return <button {...props} className={styles.button} />;
};
```

## [Documentation](https://seek-oss.github.io/treat)

See the documentation at [seek-oss.github.io/treat](https://seek-oss.github.io/treat) for more information about using treat.

## License

MIT.
