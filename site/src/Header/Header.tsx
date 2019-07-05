import React, { useState } from 'react';
import { useStyles } from 'react-treat';
import classnames from 'classnames';
import { Box, Section } from '../system';
import { Chevron } from '../Chevron/Chevron';
import NavLink from '../Typography/NavLink';
import logo from '../../../logo.png';
import docs from '../docs-store';
import * as styleRefs from './Header.treat';
import { useSticky } from './useSticky';

export default () => {
  const styles = useStyles(styleRefs);
  const [menuOpen, setMenuOpen] = useState(false);
  const isSticky = useSticky(60);
  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLinkClick = () => {
    window.scrollTo(0, 0);
    closeMenu();
  };

  return (
    <Box
      paddingTop={{ mobile: 'large', desktop: 'xlarge' }}
      paddingBottom="large"
      className={classnames(styles.root)}
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
            <Chevron direction={menuOpen ? 'up' : 'down'} />
          </div>
        </Box>

        <Box
          paddingTop={{ mobile: 'large', desktop: 'xlarge' }}
          className={styles.linksContainer}
          style={{ display: menuOpen ? 'block' : 'none' }}
        >
          <div className={styles.links}>
            {docs.map(({ title, route }) => (
              <NavLink exact key={route} to={route} onClick={handleLinkClick}>
                {title}
              </NavLink>
            ))}
          </div>
        </Box>
      </Section>
    </Box>
  );
};
