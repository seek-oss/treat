import React from 'react';
import { useStyles } from 'react-treat';
import { NavLink, NavLinkProps } from 'react-router-dom';
import classnames from 'classnames';
import * as typeStyleRefs from './typography.treat';
import * as linkStyleRefs from './NavLink.treat';

interface LinkProps extends NavLinkProps {
  baseline?: boolean;
}
export default ({ baseline, children, ...restProps }: LinkProps) => {
  const typeStyles = useStyles(typeStyleRefs);
  const linkStyles = useStyles(linkStyleRefs);

  return (
    <NavLink
      {...restProps}
      className={classnames(
        typeStyles.fontFamily,
        typeStyles.text.standard.fontSize,
        {
          [typeStyles.text.standard.transform]: baseline,
        },
      )}
      activeClassName={linkStyles.active}
    >
      {children}
    </NavLink>
  );
};
