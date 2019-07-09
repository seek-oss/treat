import React from 'react';
import { useStyles } from 'react-treat';
import { NavLink, NavLinkProps } from 'react-router-dom';
import classnames from 'classnames';
import * as typeStyleRefs from './typography.treat';
import * as linkStyleRefs from './NavLink.treat';

interface LinkProps extends NavLinkProps {
  baseline?: boolean;
  size?: 'standard' | 'small' | 'xsmall';
}
export default ({
  baseline,
  size = 'standard',
  children,
  ...restProps
}: LinkProps) => {
  const typeStyles = useStyles(typeStyleRefs);
  const linkStyles = useStyles(linkStyleRefs);

  return (
    <NavLink
      {...restProps}
      className={classnames(
        linkStyles.link,
        typeStyles.font.body,
        typeStyles.text[size].fontSize,
        {
          [typeStyles.text[size].transform]: baseline,
        },
      )}
      activeClassName={linkStyles.active}
    >
      {children}
    </NavLink>
  );
};
