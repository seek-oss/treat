---
title: Data types
---

# Data Types

While not an exhaustive list of all types defined in the library, this section covers the core data types that are essential to using the library.

## Styles

Type: `object`

When passing styles to the [`style`](styling-api#style), [`styleMap`](styling-api#stylemap) and [`styleTree`](styling-api#styletree) functions, or returning styles from a [`ThemedStyles` function](#themedstyles), you'll need to define them in the following format.

```js
{
  color: 'red',
  fontFamily: 'comic sans ms',
  fontSize: 24
}
```

Simple pseudo selectors are supported at the top level.

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

For anything more advanced, you can provide a set of custom selectors. Within each selector, you must target the ampersand character (`&`), which refers to the element currently being styled.

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

Within selectors, existing treat classes can be referenced with standard string interpolation.

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

## ThemedStyles

Type: `function`

Accepts a [`Theme`](#theme) and returns a [`Styles` object.](#styles)

```js
theme => ({
  color: theme.brandColor
});
```

## Theme

When [defining themes](styling-api#createtheme) and [consuming themes](#themedstyles), the provided theme object uses the `Theme` type, which is `any` by default. This means that any usage of a theme will not be type-safe.

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
  type MyTheme = import('./types').Theme;
  export interface Theme extends MyTheme {}
}
```

Alternatively, if you'd prefer to avoid global types, you can manually annotate the theme object being passed into a [`ThemedStyles` function.](#themedstyles)

```tsx
import { style } from 'treat';
import { Theme } from './types';

const themedClass = style((theme: Theme) => ({
  color: theme.brandColor
}));
```
