import exportTypes from './export-types.treat';
import { stringify } from 'javascript-stringify';

const node = document.createElement('pre');
node.setAttribute('id', 'main');
node.innerText = stringify(exportTypes, null, 2)!;

document.body.appendChild(node);
