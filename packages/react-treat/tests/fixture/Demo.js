import React from 'react';
import classnames from 'classnames';
import { useStyles } from 'react-treat';

import * as styleRefs from './Demo.treat';

export default () => {
  const styles = useStyles(styleRefs);

  return (
    <div
      id="main"
      className={classnames(
        styles.foo.someStyle.button,
        styles.nonThemeStyles.yellow,
      )}
    >
      This font is always yellow
    </div>
  );
};
