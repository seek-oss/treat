<div align="center" >
  <img src="./logo.png" alt="treat" width="310px" />
  <br/>
  <br/>
  Themeable, statically extracted CSS-in-JS with near-zero runtime.
  <hr />

[![Build Status](https://img.shields.io/travis/seek-oss/treat/master.svg?logo=travis&style=for-the-badge)](http://travis-ci.org/seek-oss/treat) [![treat@next](https://img.shields.io/npm/v/treat/next.svg?label=treat@next&logo=npm&style=for-the-badge)](https://www.npmjs.com/package/treat) [![Spectrum Community](https://img.shields.io/badge/community-spectrum-a36ae4.svg?style=for-the-badge)](https://spectrum.chat/treatcss)

  <hr />
</div>

```bash
$ yarn add treat@next
```

Write your styles in JavaScript/TypeScript within **_treat files_** (e.g. `Button.treat.js`) that get **_executed at build time_**.

All CSS rules are created ahead of time, so the runtime is _very_ lightweight—only needing to swap out pre-existing classes. In fact, if your application doesn't use theming, you don't even need the runtime at all.

**All CSS logic, including its dependencies, will not be included in your final bundle.**

Because theming is achieved by generating multiple classes, **_legacy browsers are supported._**

---

- [Requirements](#requirements)
- [Example Usage](#example-usage)
  - [Basic Usage](#basic-usage)
  - [Themed Usage](#themed-usage)
- [Setup](#setup)
  - [Webpack Setup](#webpack-setup)
  - [Babel Setup](#babel-setup)
- [API Reference](#api-reference)
  - [Data Types](#data-types)
    - [Style](#style-type)
    - [ThemedStyle](#themedstyle)
    - [Theme](#theme)
  - [Style API](#style-api)
    - [createTheme](#createtheme)
    - [style](#style)
    - [styleMap](#stylemap)
    - [styleTree](#styletree)
    - [globalStyle](#globalstyle)
  - [Debugging](#debugging)
  - [Runtime API](#runtime-api)
    - [resolveStyles](#resolvestyles)
    - [resolveClassName](#resolveclassname)
  - [React API](#react-api)
    - [TreatProvider](#treatprovider)
    - [useStyles](#usestyles)
    - [useClassName](#useclassname)
  - [Webpack Plugin API](#webpack-plugin-api)

---

## Requirements

Your project must be using [webpack](#webpack-setup) with the supplied [webpack plugin](#webpack-setup), but that's it.

**First-class support is provided for [React](https://reactjs.org/) and [TypeScript](https://www.typescriptlang.org/),** but those layers are _entirely optional._ The core [runtime API](#runtime-api) can also be integrated into other frameworks, if needed.

The core runtime makes use of [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map), so you may need to provide a [polyfill](https://www.npmjs.com/package/es6-map) for [pre-ES2015 browsers.](https://caniuse.com/#feat=es6)

## Example Usage

### Basic Usage

First, define and export [styles](#style-type) from a treat file.

```js
// Button.treat.js

// ** THIS CODE WON'T END UP IN YOUR BUNDLE! **

import { style } from 'treat';

export const button = style({
  backgroundColor: 'blue',
  height: 48
});
```

Then, import the styles.

```js
// Button.js

import * as styles from './Button.treat.js';

export default ({ text }) =>
  `<button class="${styles.button}">${text}</button>`;
```

### Themed Usage

> Note: React is [not required](#runtime-api) to use treat.

First, create and export a theme from a treat file. Normally, you'd define multiple themes, but let's keep it short.

```js
// theme.treat.js

// ** THIS CODE WON'T END UP IN YOUR BUNDLE! **

import { createTheme } from 'treat';

export default createTheme({
  brandColor: 'blue',
  grid: 4
});
```

Then, import the desired theme and pass it to [`TreatProvider`](TreatProvider) at the root of your application.

```js
// App.js

import React from 'react';
import { TreatProvider } from 'react-treat';

import theme from './theme.treat.js';

export function App() {
  return <TreatProvider theme={theme}>...</TreatProvider>;
}
```

Now that you've configured the theming system, define and export [themed styles](#themedstyle) from a treat file.

```js
// Button.treat.js

// ** THIS CODE WON'T END UP IN YOUR BUNDLE EITHER! **

import { style } from 'treat';

export const button = style(theme => ({
  backgroundColor: theme.brandColor,
  height: theme.grid * 11
}));
```

Then import and resolve themed styles via the [`useStyles` Hook.](#usestyles)

```js
// Button.js

import React from 'react';
import { useStyles } from 'react-treat';
import * as styleRefs from './Button.treat.js';

export function Button(props) {
  const styles = useStyles(styleRefs);

  return <button {...props} className={styles.button} />;
}
```

## Setup

### Webpack Setup

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

### Babel Setup

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

## API Reference

### Data Types

While not an exhaustive list of all types defined in the library, this section covers the core data types that are essential to using the library.

#### Style type

Type: `object`

When passing styles to the [`style`](#style), [`styleMap`](#stylemap) and [`styleTree`](#styletree) functions, or returning styles from a [`ThemedStyle` function](#themedstyle), you'll need to define them in the following format.

```js
{
  color: 'red',
  fontFamily: 'comic sans ms',
  fontSize: 24
}
```

Simple psuedo selectors are supported at the top level.

```js
{
  color: 'red',
  ':hover': {
    backgroundColor: 'pink'
  },
  ':active': {
    backgroundColor: 'tomato'
  }
}
```

Media queries are also supported via the `@media` key.

```js
{
  fontSize: 24,
  '@media': {
    'screen and (min-width: 768px)': {
      fontSize: 42
    }
  }
}
```

For anything more advanced, you can provide a set of custom selectors. Within each selector, you must target the ampersand character (`&`), which refers to the generated class name.

```js
{
  marginRight: 10,
  selectors: {
    '&:nth-child(2n)': {
      marginRight: 0
    }
  }
}
```

Within selectors, existing treat classes can be referenced.

```js
{
  backgroundColor: 'white',
  selectors: {
    [`${parentClass} &`]: {
      backgroundColor: 'aqua'
    }
  }
}
```

The `@keyframes` property allows the creation of keyframes that will automatically be attached to the style as your `animation-name`.

```js
{
  backgroundColor: 'white',
  '@keyframes': {
    from: {
      transform: 'rotate(0deg)',
    },
    to: {
      transform: 'rotate(359deg)',
    },
  },
  animationTimingFunction: 'linear',
  animationDuration: '1.5s',
}
```

The animation shorthand is also supported via a `@keyframes` placeholder.

```js
{
  backgroundColor: 'white',
  '@keyframes': {
    from: {
      transform: 'rotate(0deg)',
    },
    to: {
      transform: 'rotate(359deg)',
    },
  },
  animation: '@keyframes 1.5s linear'
}
```

#### ThemedStyle

Type: `function`

Accepts a [`Theme`](#theme) and returns a [`Style` object.](#style-type)

```js
theme => ({
  color: theme.brandColor
});
```

#### Theme

When [defining themes](#createtheme) and [consuming themes](#themedstyle), the provided theme object uses the `Theme` type, which is `any` by default. This means that any usage of a theme will not be type-safe.

The simplest way to fix this is to override this type at a global level. For example, you could create a `treat.d.ts` file in your project with the following contents.

```tsx
declare module 'treat/theme' {
  export interface Theme {
    brandColor: string;
    grid: number;
  }
}
```

If your `Theme` type is already defined elsewhere in your application, you'll need to import it with a dynamic `import` expression within the module declaration block.

```tsx
declare module 'treat/theme' {
  export type Theme = import('./types').Theme;
}
```

Alternatively, if you'd prefer to avoid global types, you can manually annotate the theme object being passed into a [`ThemedStyle` function.](#themedstyle)

```tsx
import { style } from 'treat';
import { Theme } from './types';

const themedClass = style((theme: Theme) => ({
  color: theme.brandColor
}));
```

### Style API

The following style APIs are only valid within treat files (e.g. `Button.treat.js`).

#### createTheme

Type: `function`

The `createTheme` function allows you to register individual themes within a treat file.

```js
import { createTheme } from 'treat';

const theme = createTheme({
  brandColor: 'blue',
  grid: 4
});
```

#### style

Type: `function`

The `style` function allows you to create individual style rules within a treat file.

```js
import { style } from 'treat';

export const brandColor = style(theme => ({
  color: theme.brandColor;
}));
```

If your styles aren't dependent on the theme, you can provide a static object instead.

```js
import { style } from 'treat';

export const green = style({
  color: 'green'
});
```

#### styleMap

Type: `function`

The `styleMap` function allows you to easily create multiple namespaces within a treat file.

```js
import { styleMap } from 'treat';

export const variants = styleMap(theme => ({
  primary: {
    backgroundColor: theme.colors.brand
  },
  secondary: {
    backgroundColor: theme.colors.accent
  }
}));
```

This is particularly useful when mapping component props to separate style maps. For example, if you wanted to map these styles to a React component in TypeScript:

```ts
import React from 'react';
import { useStyles } from 'react-treat';
import * as styleRefs from './Button.treat';

export function Button({ variant = 'primary', ...props }) {
  const styles = useStyles(styleRefs);

  return (
    <button
      {...props}
      className={styles.variants[variant]}
    />
  );
}
```

This pattern scales extremely well to [atomic CSS patterns](https://css-tricks.com/lets-define-exactly-atomic-css/). For example:

```js
// atoms.treat.js

import { styleMap } from 'treat';
import { mapValues } from 'lodash';

const spacingTokens = {
  small: 4,
  medium: 8,
  large: 16
};

const spacingStyles = property =>
  mapValues(spacingTokens, value => ({
    [property]: value
  }));

export const padding = {
  top: styleMap(spacingStyles('paddingTop')),
  bottom: styleMap(spacingStyles('paddingBottom')),
  left: styleMap(spacingStyles('paddingLeft')),
  right: styleMap(spacingStyles('paddingRight'))
};

// etc...
```

#### styleTree

Type: `function`

> Note: This is an advanced feature that you _probably_ don't need. Only use this if you've exhausted all other options.

The `styleTree` function allows you to create complex, nested data structures based on your theme.

For example, if you wanted to create a nested atomic CSS structure (e.g. `atoms.padding.top.desktop`), which requires iterating over _both_ your white space scale _and_ your breakpoints:

```js
// atoms.treat.js

import { styleTree } from 'treat';
import { mapValues } from 'lodash';

const responsiveSpacingStyles = property =>
  styleTree((theme, styleNode) =>
    mapValues(theme.spacing, space =>
      mapValues(theme.breakpoints, minWidth =>
        styleNode({
          '@media': {
            [`screen and (min-width: ${minWidth}px)`]: {
              [property]: space * theme.grid
            }
          }
        })
      )
    )
  );

export const padding = {
  top: responsiveSpacingStyles('paddingTop'),
  bottom: responsiveSpacingStyles('paddingBottom'),
  left: responsiveSpacingStyles('paddingLeft'),
  right: responsiveSpacingStyles('paddingRight')
};

// etc...
```

#### globalStyle

Type: `function`

The `globalStyle` function allows you to define selector-based styles. This function is purely a side effect and does not create a new class.

```js
import { globalStyle } from 'treat';

globalStyle('html, body', {
  margin: 0,
  padding: 0
});
```

### Debugging

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

### Runtime API

> Note: If you're using React, you should use our [React API](#react-api) instead.

#### resolveStyles

Type: `function`

Resolves styles for an entire treat file relative to a given theme.

```js
import { resolveStyles } from 'treat';
import * as styleRefs from './styles.treat.js';
import theme from './theme.treat.js';

const styles = resolveStyles(theme, styleRefs);
```

#### resolveClassName

Type: `function`

Resolves a single treat class name relative to a given theme.

```js
import { resolveClassName } from 'treat';

import theme from './theme.treat.js';
import * as styleRefs from './Button.treat.js';

const className = resolveClassName(theme, styleRefs.button);
```

### React API

> Note: React is [not required](#runtime-api) to use treat.

#### TreatProvider

Type: `Component`

In order for the [`useStyles`](#usestyles) and [`useClassName`](#useclassname) Hooks to work, you'll need to render a `TreatProvider` higher in the tree.

```js
import React from 'react';
import { TreatProvider } from 'react-treat';

import theme from './theme.treat.js';

export function App() {
  return <TreatProvider theme={theme}>...</TreatProvider>;
}
```

#### useStyles

Type: `function`

A [React Hook](https://reactjs.org/docs/hooks-intro.html) that resolves styles for an entire treat file relative to the current theme.

```js
import React from 'react';
import { useStyles } from 'react-treat';
import * as styleRefs from './Button.treat.js';

export function Button({ primary, ...props }) {
  const styles = useStyles(styleRefs);

  return <button {...props} className={styles.button} />;
}
```

#### useClassName

Type: `function`

A [React Hook](https://reactjs.org/docs/hooks-intro.html) that resolves a single treat class relative to the current theme.

```js
import React from 'react';
import { useClassName } from 'react-treat';
import * as styleRefs from './Button.treat.js';

export const Button = props => (
  <button
    {...props}
    className={useClassName(styles.button)}
  />
);
```

### Webpack Plugin API

| option         | description                                                                                                                                         | default value                                                                                                                              |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| test           | [Webpack condition](https://webpack.js.org/configuration/module/#rule-conditions) targetting `treat` files.                                         | `/\.treat.(js\|ts)$/`                                                                                                                      |
| outputCSS      | Whether to output CSS into the bundle. Useful for dual config SSR apps.                                                                             | `true`                                                                                                                                     |
| outputLoaders  | Array of webpack loaders to handle CSS files, they will be placed after `css-loader`. Strings and objects with options are supported.               | `['style-loader']`                                                                                                                         |
| localIdentName | Template string for naming css classes. Should always contain a `hash` option to avoid clashes.                                                     | Development: `[name]-[local]_[hash:base64:5]`<br /><br />Production: `[hash:base64:5]`                                                     |
| themeIdentName | Same as `localIdentName` but for themes. Useful for debugging which classes belong to which theme. Can also be a function that receives your theme. | Development: `_[name]-[local]_[hash:base64:4]`<br /><br />Production: `[hash:base64:4]`                                                    |
| minify         | Minify the output css                                                                                                                               | Inferred from [webpack mode](https://webpack.js.org/concepts/#mode). Defaults to `true` if `production` mode.                              |
| browsers       | A [browserslist](https://github.com/browserslist/browserslist) query to pass to [autoprefixer](https://github.com/postcss/autoprefixer)             | By default, your browserslist query will be resolved from your [browserslist config](https://github.com/browserslist/browserslist#queries) |

## Thanks

- [Johannes Ewald](https://twitter.com/Jhnnns) for letting us have the `treat` name on npm.
- [Nathan Nam Tran](https://twitter.com/naistran) for creating [css-in-js-loader](https://github.com/naistran/css-in-js-loader), which served as the initial starting point for our approach.

## License

MIT.
