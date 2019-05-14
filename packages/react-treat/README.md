# 🍬 react-treat

[![react-treat@next](https://img.shields.io/npm/v/react-treat/next.svg?label=react-treat@next&logo=npm&style=for-the-badge)](https://www.npmjs.com/package/react-treat)

React bindings for [treat](https://github.com/seek-oss/treat).

[View full documentation.](https://github.com/seek-oss/treat)

## Setup

```bash
$ yarn add react-treat@next
```

## API

#### TreatProvider

Type: `Component`

In order for the [`useClassNames`](#useclassnames) and [`useStyles`](#usestyles) Hooks to work, you'll need to render a `TreatProvider` higher in the tree.

```js
import React from 'react';
import { TreatProvider } from 'react-treat';

import theme from './theme.treat.js';

export function App() {
  return <TreatProvider theme={theme}>...</TreatProvider>;
}
```

#### useClassNames

Type: `function`

A [React Hook](https://reactjs.org/docs/hooks-intro.html) that resolves treat classes relative to the current theme, returning a single `className` string. Serves as a treat-enabled version of the [Classnames API](https://github.com/JedWatson/classnames#usage).

```js
import React from 'react';
import { useClassNames } from 'react-treat';

import * as styles from './Button.treat.js';

export function Button({ primary, ...props }) {
  return (
    <button
      {...props}
      className={useClassNames(
        styles.button,
        {
          [styles.primary]: primary
        }
        ...etc
      )}
    />
  );
}
```

#### useStyles

Type: `function`

A [React Hook](https://reactjs.org/docs/hooks-intro.html) that resolves an entire object of treat classes relative to the current theme.

```js
import React from 'react';
import { useClassNames } from 'react-treat';

import * as styleRefs from './Button.treat.js';

export function Button({ primary, ...props }) {
  const styles = useStyles(styleRefs);

  return (
    <button
      {...props}
      className={`${styles.button} ${
        primary ? styles.primary : ''
      }`}
    />
  );
}
```

## License

MIT.
