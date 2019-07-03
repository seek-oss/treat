import React, { useState } from 'react';
import { useStyles } from 'react-treat';
import classnames from 'classnames';
import { Box, Section } from '../system';
import { Chevron } from './Chevron';
import NavLink from '../Typography/NavLink';
import logo from '../../../logo.png';
import docs from '../docs-store';
import * as styleRefs from './Header.treat';
import { useSticky } from './useSticky';

export default () => {
  const styles = useStyles(styleRefs);
  const [menuOpen, setMenuOpen] = useState(false);
  const isSticky = useSticky(40);
  const closeMenu = () => {
    window.scrollTo(0, 0);
    setMenuOpen(false);
  };

  return (
    <Box
      paddingTop="large"
      paddingBottom="large"
      className={classnames(styles.root, isSticky ? styles.sticky : null)}
      onMouseLeave={closeMenu}
    >
      <Section>
        <Box
          display="inline-flex"
          alignItems="center"
          className={styles.logoContainer}
          onClick={() => setMenuOpen(curr => !curr)}
        >
          <img src={logo} height="40" />
          <div className={styles.chevron}>
            <Chevron active={menuOpen} />
          </div>
        </Box>

        <Box
          paddingTop="large"
          style={{ display: menuOpen ? 'block' : 'none' }}
        >
          <div className={styles.links}>
            {docs.map(({ title, route }) => (
              <NavLink key={route} to={route} onClick={closeMenu}>
                {title}
              </NavLink>
            ))}
          </div>
        </Box>
      </Section>
    </Box>
  );
};
