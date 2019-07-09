import React, { useState, Fragment } from 'react';
import { useStyles } from 'react-treat';
import classnames from 'classnames';
import { Box, Section } from '../system';
import { Chevron } from '../Chevron/Chevron';
import NavLink from '../Typography/NavLink';
import logo from '../../../logo.png';
import docs from '../docs-store';
import * as styleRefs from './Header.treat';
import Link from '../Typography/Link';

export default () => {
  const styles = useStyles(styleRefs);
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => {
    setMenuOpen(false);
  };

  const closeMenuAndScrollToTop = () => {
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
        <div style={{ display: 'none' }}>
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
        </div>

        <Box
          paddingTop={{ mobile: 'large', desktop: 'medium' }}
          className={styles.linksContainer}
          style={{ display: menuOpen ? 'block' : 'none' }}
        >
          <div className={styles.links}>
            {docs.map(({ title, route, sections }) => (
              <Fragment key={route}>
                <Box paddingBottom="xsmall">
                  <NavLink
                    size="xsmall"
                    exact
                    to={route}
                    onClick={closeMenuAndScrollToTop}
                  >
                    {title}
                  </NavLink>
                </Box>
                <Box paddingBottom="large">
                  {sections
                    .filter(({ level }) => level === 2)
                    .map(({ hash, name }) => (
                      <Box key={hash}>
                        <Link
                          size="small"
                          to={`${route}#${hash}`}
                          onClick={closeMenu}
                          className={styles.subLink}
                        >
                          {name}
                        </Link>
                      </Box>
                    ))}
                </Box>
              </Fragment>
            ))}
          </div>
        </Box>
      </Section>
    </Box>
  );
};
