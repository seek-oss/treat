---
title: How it works
---

# How it works

## Static extraction

Blah blah

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
