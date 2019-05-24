import React from 'react';
import { Link, NavLinkProps } from 'react-router-dom';
import classnames from 'classnames';
import * as styles from './typography.treat';

interface LinkProps extends NavLinkProps {
  baseline?: boolean;
}
export default ({ baseline, children, ...restProps }: LinkProps) => (
  <Link
    {...restProps}
    className={classnames(styles.fontFamily, styles.text.standard.fontSize, {
      [styles.text.standard.transform]: baseline,
    })}
  >
    {children}
  </Link>
);
