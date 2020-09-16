import styles from './feature-queries.treat';

const node = document.createElement('div');

node.setAttribute('id', 'main');
node.appendChild(
  document.createTextNode(
    'This is a grid container if the browser supports it',
  ),
);
node.setAttribute('class', `${styles}`);

document.body.appendChild(node);
