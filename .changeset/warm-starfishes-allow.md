---
'treat': major
---

`treat/webpack-plugin` is now an ES module.

BREAKING CHANGE: 
When importing `treat/webpack-plugin` in a commonjs file you must now use the named export `TreatPlugin`.

```js
const { TreatPlugin } = require('treat/webpack-plugin');
```