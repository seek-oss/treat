import React, { useState } from 'react';
import { useClassNames } from 'react-treat';

import styles, { nonThemeStyles } from './Demo.treat';
import two from './Demo2.treat';
import three from './Demo3.treat';

export default () => {
  const [hide, setHide] = useState(false);

  return (
    <>
      <input type="checkbox" checked={hide} onChange={() => setHide(!hide)} />
      <div
        className={useClassNames(
          styles.foo.someStyle.button,
          nonThemeStyles.yellow,
          styles.courier,
          styles.strong,
          {
            [nonThemeStyles.hide]: hide,
          },
          two,
          three,
        )}
      >
        This font is always yellow
      </div>
    </>
  );
};
