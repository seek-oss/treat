---
title: How it works
---

# How it works

## Static extraction

In order to support static extraction of CSS from JavaScript code, styles are authored in JavaScript files with a special extension (`.treat.js`/`.treat.ts` by default). We refer to these files as _treat files._

These treat files are separated from regular JavaScript files so that they can be compiled and executed at build time rather than being executed in the browser.

Conceptually, this is no different to preprocessors like Sass and Less. The difference is that, rather than using a custom domain-specific language, treat lets you use _JavaScript_ as your preprocessor.

Within treat files, treat exposes a set of [styling APIs](styling-api) for generating CSS. Calling these APIs will result in styles being added to your application bundle. In order to expose these styles to your application code, they must be explicitly exported:

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
.GENERATED_CLASS_NAME_greenTheme {
  color: green;
}
.GENERATED_CLASS_NAME_redTheme {
  color: red;
}
```

Now that we've generated styles for each theme, the [runtime API](runtime-api) can be used to resolve the correct class for the desired theme.

Theming in this way allows full static extraction of themed styles. However, it comes with an important trade-off.

In order to ensure consistent specificity across different themes, themed styles are generated with higher precedence than non-themed styles. As a result, you need to be careful when mixing themed and non-themed styles in a single treat file.

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

Note that the style order has changed, with the non-themed styles rising to the top of the file. As a result, the `inactive` class won't take effect when the `active` class is also being used.

To avoid this issue, while authoring styles, you should be mindful not to rely on style overrides, or at the very least, avoid overriding themed styles with non-themed styles.

## Runtime

> If you're not using any themeing, the runtime is **not** required.

Currently, the treat runtime only performs one task, resolving themed styles to the requested themed class.

It does this by walking the exports of your treat file and returning a new structure that has the same type definition. As module exports are static, the runtime will cache the result in memory so the walk only needs to be performed once per treat file. This means you can import a single treat file many times across your app but only perform the transform once. If you switch theme at runtime the transform will run again.
