import { resolveStyles } from 'treat';
import theme from './theme.treat';
import styleRefs from './styles.treat';

const node = document.createElement('div');

const styles = resolveStyles(theme, styleRefs);

node.setAttribute('id', 'main');
node.setAttribute('class', `${styles.regularStyle} ${styles.themeStyle}`);

document.body.appendChild(node);
