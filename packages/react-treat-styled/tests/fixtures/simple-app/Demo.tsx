import React from 'react';
import { styled } from 'react-treat-styled';

import * as styles from './Demo.treat';

const Test = styled.div([
  styles.foo.someStyle.button,
  styles.nonThemeStyles.yellow,
]);

export default () => <Test id="main">This font is always yellow</Test>;
