import React from 'react';
import { Link, NavLinkProps } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { useStyles } from 'react-treat';
import classnames from 'classnames';
import * as styleRefs from './typography.treat';
import * as linkStyleRefs from './Link.treat';

interface LinkProps extends NavLinkProps {
  baseline?: boolean;
  size?: 'standard' | 'small';
}
export default ({
  to,
  baseline,
  size = 'standard',
  className,
  ...restProps
}: LinkProps) => {
  const styles = useStyles(styleRefs);
  const linkStyles = useStyles(linkStyleRefs);

  const classNames = classnames(
    className,
    linkStyles.link,
    styles.font.body,
    styles.text[size].fontSize,
    {
      [styles.text[size].transform]: baseline,
    },
  );

  if (typeof to === 'string' && /^http/.test(to)) {
    return <a href={to} {...restProps} className={classNames} />;
  }

  if (typeof to === 'string' && to.indexOf('#') > -1) {
    return <HashLink to={to} {...restProps} className={classNames} />;
  }

  return (
    <Link
      onClick={() => {
        window.scrollTo(0, 0);
      }}
      to={to}
      {...restProps}
      className={classNames}
    />
  );
};
