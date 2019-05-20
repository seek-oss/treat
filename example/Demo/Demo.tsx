import React, { useState } from 'react';
import { useStyles, useClassName } from 'react-treat';
import classnames from 'classnames';
import * as demo1Refs from './Demo1.treat';
import demo2Refs from './Demo2.treat';
import demo3Refs from './Demo3.treat';

export default () => {
  const [hide, setHide] = useState(false);

  const demo1Styles = useStyles(demo1Refs);
  const demo2 = useClassName(demo2Refs);
  const demo3 = useClassName(demo3Refs);

  return (
    <>
      <input type="checkbox" checked={hide} onChange={() => setHide(!hide)} />
      <div
        className={classnames(
          demo1Styles.foo.someStyle.button,
          demo1Styles.courier,
          demo1Styles.strong,
          demo1Styles.nonThemeStyles.yellow,
          {
            [demo1Styles.nonThemeStyles.hide]: hide,
          },
          demo2,
          demo3,
        )}
      >
        This font is always yellow
      </div>
    </>
  );
};
