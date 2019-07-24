---
title: Styling API
---

# Styling API

The following styling APIs are only valid within treat files (e.g. `Button.treat.js`).

## createTheme

Type: `function`

The `createTheme` function allows you to register individual themes within a treat file.

```js
import { createTheme } from 'treat';

const theme = createTheme({
  brandColor: 'blue',
  grid: 4
});
```

## style

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

## styleMap

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

export const margin = {
  top: styleMap(spacingStyles('marginTop')),
  bottom: styleMap(spacingStyles('marginBottom')),
  left: styleMap(spacingStyles('marginLeft')),
  right: styleMap(spacingStyles('marginRight'))
};

// etc...
```

## styleTree

Type: `function`

> Note: This is an advanced feature that you _probably_ don't need. It can only create themed styles. Only use this if you've exhausted all other options.

The `styleTree` function allows you to create complex, nested data structures based on your theme.

For example, if you wanted to create a nested atomic CSS structure (e.g. `atoms.padding.top.desktop`), which requires iterating over _both_ your white space scale _and_ your breakpoints, you could do the following:

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

> Note: When using `styleTree`, the [babel-plugin](setup#babel-setup) does not add a local debug name for you, as it is too complex to infer in most cases. However, you can still manually pass a local debug name to the `styleNode` function you receive.

## globalStyle

Type: `function`

The `globalStyle` function allows you to define selector-based styles. This function is purely a side effect and does not create a new class.

```js
import { globalStyle } from 'treat';

globalStyle('html, body', {
  margin: 0,
  padding: 0
});
```
