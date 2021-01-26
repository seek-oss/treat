import { resolveStyles } from 'treat';
import styleRefs from './styles.treat';

Promise.all([import('./themeA.treat'), import('./themeB.treat')]).then(
  (themes) => {
    const themeA = themes[0].default;
    const themeB = themes[1].default;

    const themeAStyles = resolveStyles(themeA, styleRefs);
    const themeBStyles = resolveStyles(themeB, styleRefs);

    const themeANode = document.createElement('div');
    themeANode.setAttribute('id', 'themeA');
    themeANode.setAttribute(
      'class',
      `${themeAStyles.regularStyle} ${themeAStyles.themeStyle}`,
    );

    const themeBNode = document.createElement('div');
    themeBNode.setAttribute('id', 'themeB');
    themeBNode.setAttribute(
      'class',
      `${themeBStyles.regularStyle} ${themeBStyles.themeStyle}`,
    );

    document.body.appendChild(themeANode);
    document.body.appendChild(themeBNode);
  },
);
