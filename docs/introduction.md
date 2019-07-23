---
title: Introduction
---

# Themeable, statically extracted CSS-in-JS with near-zero runtime.

Write your styles in JavaScript/TypeScript within **_treat files_** (e.g. `Button.treat.js`) that get **_executed at build time_**.

All CSS rules are created ahead of time, so the runtime is _very_ lightweight—only needing to swap out pre-existing classes. In fact, if your application doesn't use theming, you don't even need the runtime at all.

**All CSS logic, including its dependencies, will not be included in your final bundle.**

Because theming is achieved by generating multiple classes, **_legacy browsers are supported._**

## Requirements

Your project must be using [webpack](webpack-options) with the supplied [webpack plugin](webpack-options), but that's it.

**First-class support is provided for [React](https://reactjs.org/) and [TypeScript](https://www.typescriptlang.org/),** but those layers are _entirely optional._ The core [runtime API](runtime-api) can also be integrated into other frameworks, if needed.

The core runtime makes use of [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map), so you may need to provide a [polyfill](https://www.npmjs.com/package/es6-map) for [pre-ES2015 browsers.](https://caniuse.com/#feat=es6)

## Basic Usage

First, define and export [styles](data-types#styles) from a treat file.

```js
// Button.treat.js

// ** THIS CODE WON'T END UP IN YOUR BUNDLE! **

import { style } from 'treat';

export const button = style({
  backgroundColor: 'blue',
  height: 48
}));
```

Then, import the styles.

```js
// Button.js
import * as styles from './Button.treat.js';

export const Button = ({ text }) => `
  <button class="${styles.button}">${text}</button>
`;
```

## Themed Usage

> React is [not required](runtime-api) to use treat.

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

Then, import the desired theme and pass it to [`TreatProvider`](react-api#treatprovider) at the root of your application.

```js
// App.js
import React from 'react';
import { TreatProvider } from 'react-treat';

import theme from './theme.treat.js';

export const App = () => (
  <TreatProvider theme={theme}>...</TreatProvider>
);
```

Now that you've configured the theming system, define and export [themed styles](data-types#themedstyles) from a treat file.

```js
// Button.treat.js
// ** THIS CODE WON'T END UP IN YOUR BUNDLE EITHER! **
import { style } from 'treat';

export const button = style(theme => ({
  backgroundColor: theme.brandColor,
  height: theme.grid * 11
}));
```

> Themed styles have higher precedence than non-themed styles, regardless of document order. For more information, read the [theming](how-it-works#theming) guide.

Then import and resolve themed styles via the [`useStyles` Hook.](react-api#usestyles)

```js
// Button.js
import React from 'react';
import { useStyles } from 'react-treat';
import * as styleRefs from './Button.treat.js';

export const Button = props => {
  const styles = useStyles(styleRefs);

  return <button {...props} className={styles.button} />;
};
```

## Trade-offs

There's a lot of CSS-in-JS solutions available, however, `treat` has taken quite a different approach. The primary goals of treat are full static extraction, minimal runtime code and type safety. While a great developer experience is important to us, it will never come at the cost of those goals.

If you're used to a library like [styled-components](https://www.styled-components.com) than `treat` might seem like a step backwards. [styled-components](https://www.styled-components.com) can easily create a lot styles bound to components quickly. However, `treat` requires a few more steps to bind styles to your components. It is also unable to generate styles at runtime, and therefore can not handle dynamic themeing.

The upside of `treat` is it allows you to craft highly re-usable utilty CSS using JavaScript, adding next to zero to bundle size and a negligible runtime performance cost. Checkout [tailwindcss](https://tailwindcss.com/) for a great example of this style of CSS, or our component library [Braid](https://github.com/seek-oss/braid-design-system) for a `treat` specific example.
