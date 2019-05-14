import React from 'react';
import { useClassNames } from 'react-treat';

import styles, { nonThemeStyles } from './Demo.treat';

export default () => (
  <div
    id="main"
    className={useClassNames(
      styles.foo.someStyle.button,
      nonThemeStyles.yellow,
    )}
  >
    This font is always yellow
  </div>
);
