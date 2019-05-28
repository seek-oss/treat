import styles from './simple.treat';

const node = document.createElement('div');

node.setAttribute('id', 'main');
node.setAttribute('class', `${styles.red} ${styles.blue}`);

document.body.appendChild(node);
