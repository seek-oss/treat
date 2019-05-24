---
title: Webpack
---

# Webpack

## Webpack Plugin API

| option         | description                                                                                                                                         | default value                                                                                                                              |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| test           | [Webpack condition](https://webpack.js.org/configuration/module/#rule-conditions) targetting `treat` files.                                         | `/\.treat.(js\|ts)$/`                                                                                                                      |
| outputCSS      | Whether to output CSS into the bundle. Useful for dual config SSR apps.                                                                             | `true`                                                                                                                                     |
| outputLoaders  | Array of webpack loaders to handle CSS files, they will be placed after `css-loader`. Strings and objects with options are supported.               | `['style-loader']`                                                                                                                         |
| localIdentName | Template string for naming css classes. Should always contain a `hash` option to avoid clashes.                                                     | Development: `[name]-[local]_[hash:base64:5]`<br /><br />Production: `[hash:base64:5]`                                                     |
| themeIdentName | Same as `localIdentName` but for themes. Useful for debugging which classes belong to which theme. Can also be a function that receives your theme. | Development: `_[name]-[local]_[hash:base64:4]`<br /><br />Production: `[hash:base64:4]`                                                    |
| minify         | Minify the output css                                                                                                                               | Inferred from [webpack mode](https://webpack.js.org/concepts/#mode). Defaults to `true` if `production` mode.                              |
| browsers       | A [browserslist](https://github.com/browserslist/browserslist) query to pass to [autoprefixer](https://github.com/postcss/autoprefixer)             | By default, your browserslist query will be resolved from your [browserslist config](https://github.com/browserslist/browserslist#queries) |
