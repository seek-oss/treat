import styles from './gh-141.treat';

const node = document.createElement('div');

node.setAttribute('id', 'main');
node.appendChild(document.createTextNode('This text should be red'));
node.setAttribute('class', `${styles.foo} ${styles.bar}`);

document.body.appendChild(node);
