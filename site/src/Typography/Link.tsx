import React from 'react';
import { Link, NavLinkProps } from 'react-router-dom';
import { useStyles } from 'react-treat';
import classnames from 'classnames';
import * as styleRefs from './typography.treat';

interface LinkProps extends NavLinkProps {
  baseline?: boolean;
}
export default ({ baseline, children, ...restProps }: LinkProps) => {
  const styles = useStyles(styleRefs);

  return (
    <Link
      {...restProps}
      className={classnames(styles.fontFamily, styles.text.standard.fontSize, {
        [styles.text.standard.transform]: baseline,
      })}
    >
      {children}
    </Link>
  );
};
