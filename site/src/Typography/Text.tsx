import React, { ReactNode } from 'react';
import { useStyles } from 'react-treat';
import classnames from 'classnames';

import * as styleRefs from './typography.treat';

export interface TextProps {
  baseline?: boolean;
  children: ReactNode;
}
export default ({ baseline = true, children }: TextProps) => {
  const styles = useStyles(styleRefs);

  return (
    <p
      className={classnames(styles.fontFamily, styles.text.standard.fontSize, {
        [styles.text.standard.transform]: baseline,
      })}
    >
      {children}
    </p>
  );
};
