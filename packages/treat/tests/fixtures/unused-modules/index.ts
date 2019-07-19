import { resolveClassName } from 'treat';

import theme from './theme.treat';
import { usedStyle } from './lookup';

const node = document.createElement('div');

node.setAttribute('id', 'main');
node.setAttribute('class', resolveClassName(theme, usedStyle));

document.body.appendChild(node);
