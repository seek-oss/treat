import { resolveClassName } from 'treat';

import { theme, usedStyle, usedThemeStyle } from './lookup';

const node = document.createElement('div');

node.setAttribute('id', 'main');
node.setAttribute(
  'class',
  `${resolveClassName(theme, usedStyle)}  ${resolveClassName(
    theme,
    usedThemeStyle,
  )}`,
);

document.body.appendChild(node);
