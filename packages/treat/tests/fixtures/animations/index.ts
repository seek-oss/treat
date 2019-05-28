import { resolveClassName } from 'treat';
import {
  slowTheme,
  fastTheme,
  unthemedAnimation,
  themedAnimation,
} from './animations.treat';

// Unthemed node
const node = document.createElement('div');
node.setAttribute('id', 'main');
node.setAttribute('class', unthemedAnimation);
node.appendChild(document.createTextNode('HOVER!'));
document.body.appendChild(node);

// Fast themed node
const fastNode = document.createElement('div');
fastNode.setAttribute('id', 'fast');
fastNode.setAttribute('class', resolveClassName(fastTheme, themedAnimation));
document.body.appendChild(fastNode);

// Slow themed node
const slowNode = document.createElement('div');
slowNode.setAttribute('id', 'slow');
slowNode.setAttribute('class', resolveClassName(slowTheme, themedAnimation));
document.body.appendChild(slowNode);
