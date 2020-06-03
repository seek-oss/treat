import postcss from 'postcss';
//@ts-expect-error
import postcssJs from 'postcss-js';

import transformCSS from './transformCSS';
import { setWebpackTreat } from './webpackTreat';

function createStyleElement(id: string) {
  const el = document.createElement('style');

  el.id = `treat-runtime-styles-${id}`;

  // Avoid Edge bug where empty style elements don't create sheets
  el.appendChild(document.createTextNode(''));

  return document.head.appendChild(el);
}

const localStyleElement = createStyleElement('local');

function serializeCSS(styles: any) {
  return postcss()
    .process(transformCSS(styles), { parser: postcssJs })
    .then(result => {
      return result.css;
    });
}

const themes = new Map();

setWebpackTreat({
  addLocalCss: styles => {
    serializeCSS(styles).then(css => {
      localStyleElement.append(css);
    });
  },
  addThemedCss: (themeRef, styles) => {
    const { styleElement } = themes.get(themeRef);

    serializeCSS(styles).then(css => {
      styleElement.append(css);
    });
  },
  addTheme: theme => {
    const styleElement = createStyleElement(theme.themeRef);

    themes.set(theme.themeRef, {
      theme,
      styleElement,
    });
  },
  getThemes: () => Array.from(themes.values()).map(({ theme }) => theme),
  getIdentName: (local, scopeId, theme) =>
    `${theme ? '_' : ''}${local}${scopeId}`,
});

export {
  createTheme,
  style,
  styleMap,
  styleTree,
  globalStyle,
} from './builder';
export { resolveStyles } from './resolveStyles';
export { resolveClassName } from './resolveClassName';

export {
  Style,
  GlobalStyle,
  CSSProperties,
  ThemeRef,
  ClassRef,
  TreatModule,
} from './types';
