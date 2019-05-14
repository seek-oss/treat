const postcss = require('postcss');
const postcssJs = require('postcss-js');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');

// Import from compiled code
const transformCSS = require('../lib/commonjs/transformCSS').default;

const isEmpty = obj => !obj || Object.keys(obj).length === 0;

const processCss = async (styles, { minify, browsers, from }) => {
  if (isEmpty(styles)) {
    return null;
  }

  const postcssPlugins = [autoprefixer({ browsers })];

  if (minify) {
    postcssPlugins.push(cssnano());
  }

  const { css } = await postcss(postcssPlugins).process(transformCSS(styles), {
    from,
    parser: postcssJs,
  });

  return css;
};

module.exports = processCss;
