import { resolveStyles } from 'treat';
import classnames from 'classnames';
import themeOne from './themeOne.treat';
import themeTwo from './themeTwo.treat';

import stylesOne from './stylesOne.treat';
import stylesTwo from './stylesTwo.treat';
import stylesThree from './stylesThree.treat';

const nodeOne = document.createElement('div');
const nodeTwo = document.createElement('div');

const themeOneStyles = resolveStyles(themeOne, {
  stylesOne,
  stylesTwo,
  stylesThree,
});

nodeOne.setAttribute('id', 'theme1');
nodeOne.setAttribute(
  'class',
  classnames(
    themeOneStyles.stylesOne.regularStyle,
    themeOneStyles.stylesOne.themeStyle,
    themeOneStyles.stylesTwo.regularStyle,
    themeOneStyles.stylesTwo.themeStyle,
    themeOneStyles.stylesThree.regularStyle,
    themeOneStyles.stylesThree.themeStyle,
    themeOneStyles.stylesThree.tree.border.small[0],
    themeOneStyles.stylesThree.secondTree.textColor.primary,
  ),
);

const themeTwoStyles = resolveStyles(themeTwo, {
  stylesOne,
  stylesTwo,
  stylesThree,
});

nodeTwo.setAttribute('id', 'theme2');
nodeTwo.setAttribute(
  'class',
  classnames(
    themeTwoStyles.stylesOne.regularStyle,
    themeTwoStyles.stylesOne.themeStyle,
    themeTwoStyles.stylesTwo.regularStyle,
    themeTwoStyles.stylesTwo.themeStyle,
    themeTwoStyles.stylesThree.regularStyle,
    themeTwoStyles.stylesThree.themeStyle,
    themeTwoStyles.stylesThree.tree.border.large[0],
    themeTwoStyles.stylesThree.secondTree.textColor.primary,
  ),
);

document.body.appendChild(nodeOne);
document.body.appendChild(nodeTwo);
