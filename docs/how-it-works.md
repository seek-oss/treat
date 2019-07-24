---
title: How it works
---

# How it works

## Static extraction

In order to support static extraction of CSS from JavaScript code, styles are authored in JavaScript files with a special extension (`.treat.js` / `.treat.ts` by default). We refer to these files as _treat files._

These treat files are separated from regular JavaScript files so that they can be compiled and executed at build time rather than being executed in the browser.

Conceptually, this is no different to preprocessors like [Sass](https://sass-lang.com/) and [Less](http://lesscss.org/). The difference is that, rather than using a custom domain-specific language, treat lets you use _JavaScript_ as your preprocessor.

Within treat files, treat provides a set of [styling APIs](styling-api) for generating CSS. Calling these APIs will result in styles being added to your application bundle. In order to expose these styles to your application code, they must be explicitly exported:

```js
// Button.treat.js
import { style } from 'treat';

export const button = style({
  backgroundColor: 'blue',
  height: 48
}));
```

When treat files are executed at build time, all of the exports are inlined into your bundle. For example, the treat file above would turn into this:

```js
export var button = 'GENERATED_CLASS_NAME';
```

Generated styles are separately passed through the webpack loader pipeline, which allows you to create static CSS files via [mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin).

_For more details, see our [webpack setup](setup#webpack-setup) guide._

## Theming

For [themed styles](data-types#themedstyles), treat generates a separate block of CSS for each theme.

For example, let's assume you have the following themes defined:

```js
// themes.treat.js
import { createTheme } from 'treat';

export const greenTheme = createTheme({ text: 'green' });
export const redTheme = createTheme({ text: 'red' });
```

Then, let's assume you've written the following treat file:

```js
// text.treat.js
import { style } from 'treat';

export const text = style(theme => ({ color: theme.text }));
```

This will generate the following CSS:

```css
.text_greenTheme {
  color: green;
}
.text_redTheme {
  color: red;
}
```

Now that we've generated styles for each theme, the [runtime API](runtime-api) can be used to resolve the correct class for the desired theme.

Theming in this way allows full static extraction of themed styles. However, it comes with an important trade-off.

In order to ensure consistent specificity across different themes, **themed styles are generated with higher precedence than non-themed styles.** As a result, you need to be mindful when attempting to override themed styles with non-themed styles within a single treat file.

For example, let's assume you've defined the following styles:

```js
export const inactive = style(theme => ({
  color: theme.text
}));

export const active = style({
  color: 'white'
});
```

Typically, if both of these classes were applied simultaneously to the same element, you would expect the `active` styles to override the `inactive` styles. However, in treat, this is not the case. The resulting style sheet would actually look something like this:

```css
.active {
  color: white;
}

.inactive_greenTheme {
  color: green;
}

.inactive_redTheme {
  color: red;
}
```

Note that the style order has changed, with the non-themed styles rising to the top of the file, which means that the `inactive` class will take precedence over the `active` class if both are used simultaneously.

To avoid this issue, **it's recommended that you try not to rely on style overrides across multiple classes.**

## Runtime

> If you're not using themed styles, the runtime is **not** required.

The treat runtime is extremely lightweight, only needing to perform a simple lookup to figure out which pre-generated CSS class belongs to which theme.

The core API for performing this task is the [`resolveStyles`](runtime-api#resolvestyles) function (or [`useStyles`](react-api#usestyles) if you're using React).

Let's assume we have a treat file with some complex exports:

```js
// styles.treat.js
export const topLevelExport = style(theme => ({
  color: theme.red
}));

export const objectExport = {
  key: style(theme => ({ color: theme.blue }))
};

export const arrayExport = [
  style(theme => ({ color: theme.aqua })),
  style(theme => ({ color: theme.pink }))
];
```

We can then import this module and deeply resolve all styles with a single [`resolveStyles`](runtime-api#resolvestyles) call.

> This is obviously a contrived example since we're hard-coding the desired theme. Typically, you'd want to inject themes dynamcally so that they can be configured at an application level. To see a good example of this pattern, see our [React API](react-api).

```js
import * as styleRefs from './styles.treat.js';
import { greenTheme } from './themes.treat.js';

const styles = resolveStyles(greenTheme, styleRefs);
```

In this case, the `styles` object is a deep clone of the `styleRefs` object, with all themed classes resolved relative to `greenTheme`:

```js
{
  topLevelExport: 'GENERATED_CLASS_NAME_1_greenTheme',
  objectExport: {
    key: 'GENERATED_CLASS_NAME_2_greenTheme'
  },
  arrayExport: [
    'GENERATED_CLASS_NAME_3_greenTheme',
    'GENERATED_CLASS_NAME_4_greenTheme'
  ]
}
```

Because module exports are static, the treat runtime caches the resolved `styles` object in memory, which means that this cloning and class resolution process only happens once per treat file and theme, for the lifetime of your application.

It's important to note that this resolved `styles` object has the same type signature as the original `styleRefs` object, which means that themed styles remain type safe.
