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

Themeing in treat is for creating variations on styles to provide a different look and feel for your application, that can be switched at runtime. If you only have a single theme object that you use to drive your styles (e.g. colors, row heights, etc) than avoid using `theme` styles and import your theme object directly.

Themeing in `treat` is performed at a style level. Each style is either [themed](data-types#themedstyles) or [unthemed](data-types#styles). When you create a themed style it actually creates one CSS class for each theme you have [registered](styling-api#createtheme). The [runtime](runtime-api) code ensures that the correct class is used based on what theme is requested.

Themeing in this way allows full static extraction of themed styles, however be careful when mixing themed styles with unthemed.

When two of the same style properties are set for a single element, CSS has [rules](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity) to decide which is more important, called specificty. When two properties have equal specificty, than whichever rule showed up last in the document is used.

This rule causes a clash between themed styles and unthemed styles as they can only show up in the document once. To handle this scenario, `treat` makes all themed styles more important than unthemed styles by pushing all unthemed styles to the top of the stylesheet.

```js
import { style, createTheme } from 'treat';

export const greenTheme = createTheme({
  textColor: 'green'
});

export const redTheme = createTheme({
  textColor: 'red'
});

export const themedStyle = style(theme => ({
  color: theme.textColor
}));

export const unthemedStyle = style({
  display: 'block'
});
```

In the above code you would expect the resulting stylesheet to contain the `themedStyle` first, followed by `unthemedStyle`. This is not the case. The resulting stylesheet would actually look something like the following.

```css
.unthemedStyle {
  display: 'block';
}

.themedStyle_greenTheme {
  color: 'green';
}

.themedStyle_redTheme {
  color: 'red';
}
```

To avoid duplicating all classes (whether themed or not) `treat` pushes all unthemed classes to the top. This ensures each class will have consistent importance, no matter what theme is being used. Ideally, avoid having competing properties on a single element as much as possible.

## Runtime

Blah blah
