# 🍬 next-treat

## Setup

To use `treat` in a [Next.js](https://nextjs.org) project, install `next-treat` and add it to your `next.config.js` file like this:

```js
const withTreat = require('next-treat')(/* Extra TreatPlugin options */);

module.exports = withTreat(/* Additional Next.js configuration */);
```

Debugging experience can be improved by [setting up the Babel plugin](#babel-setup) with the `.babelrc` below:

```js
{
  "presets": ["next/babel"],
  "plugins": ["babel-plugin-treat"]
}
```

## [Docs](https://seek-oss.github.io/treat)

See the documentation at seek-oss.github.io/treat for more information about using treat.

## License

MIT.
