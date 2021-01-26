import postcss from 'postcss';
import postcssJs from 'postcss-js';
import cssnano from 'cssnano';
import autoprefixer from 'autoprefixer';

import transformCSS from '../transformCSS';

const isEmpty = (obj) => !obj || Object.keys(obj).length === 0;

const processCss = async (styles, { minify, browsers, from }) => {
  if (isEmpty(styles)) {
    return null;
  }

  const postcssPlugins = [autoprefixer({ overrideBrowserslist: browsers })];

  if (minify) {
    postcssPlugins.push(cssnano());
  }

  const { css } = await postcss(postcssPlugins).process(transformCSS(styles), {
    from,
    parser: postcssJs,
  });

  return css;
};

export default processCss;
