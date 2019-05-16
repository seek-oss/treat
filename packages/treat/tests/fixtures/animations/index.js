import style from './animations.treat';

const node = document.createElement('div');

node.setAttribute('id', 'main');
node.setAttribute('class', style);
node.appendChild(document.createTextNode('HOVER!'));

document.body.appendChild(node);
