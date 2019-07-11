import { resolveClassNames } from 'treat';
import themeOne from './themeOne.treat';
import themeTwo from './themeTwo.treat';

import stylesOne from './stylesOne.treat';
import stylesTwo from './stylesTwo.treat';
import stylesThree from './stylesThree.treat';

const nodeOne = document.createElement('div');
const nodeTwo = document.createElement('div');

nodeOne.setAttribute('id', 'theme1');
nodeOne.setAttribute(
  'class',
  resolveClassNames(
    themeOne,
    stylesOne.regularStyle,
    stylesOne.themeStyle,
    stylesTwo.regularStyle,
    stylesTwo.themeStyle,
    stylesThree.regularStyle,
    stylesThree.themeStyle,
    stylesThree.tree.border.small[0],
    stylesThree.secondTree.textColor.primary,
  ),
);

nodeTwo.setAttribute('id', 'theme2');
nodeTwo.setAttribute(
  'class',
  resolveClassNames(
    themeTwo,
    stylesOne.regularStyle,
    stylesOne.themeStyle,
    stylesTwo.regularStyle,
    stylesTwo.themeStyle,
    stylesThree.regularStyle,
    stylesThree.themeStyle,
    stylesThree.tree.border.large[0],
    stylesThree.secondTree.textColor.primary,
  ),
);

document.body.appendChild(nodeOne);
document.body.appendChild(nodeTwo);
