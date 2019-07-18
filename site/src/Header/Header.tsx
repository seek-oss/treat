import React, { useState, Fragment } from 'react';
import { useStyles } from 'react-treat';
import classnames from 'classnames';
import { Box, Section } from '../system';
import NavLink from '../Typography/NavLink';
import docs from '../docs-store';
import * as styleRefs from './Header.treat';
import Link from '../Typography/Link';
import { useActiveHash } from '../useHeadingRoute';

const Fab = ({ open, onClick }: { open: boolean; onClick: () => void }) => {
  const styles = useStyles(styleRefs);

  return (
    <Box
      onClick={onClick}
      className={classnames(styles.fab, open ? styles.fab_isOpen : null)}
    >
      <Box className={styles.fab__bar} />
      <Box className={styles.fab__bar} />
      <Box className={styles.fab__bar} />
    </Box>
  );
};

export default () => {
  const styles = useStyles(styleRefs);
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(open => !open);
  const closeMenu = () => {
    setMenuOpen(false);
  };
  const activeHash = useActiveHash();

  const closeMenuAndScrollToTop = () => {
    window.scrollTo(0, 0);
    closeMenu();
  };

  return (
    <Fragment>
      <Fab open={menuOpen} onClick={toggleMenu} />
      <Box
        className={classnames(
          styles.backdrop,
          menuOpen ? styles.backdrop_isVisible : styles.backdrop_isHidden,
        )}
        onClick={closeMenu}
      />
      <Box
        paddingTop={{ mobile: 'medium', desktop: 'xlarge' }}
        paddingBottom="large"
        className={classnames(
          styles.menu,
          menuOpen ? styles.menu_isOpen : styles.menu_isClosed,
        )}
      >
        <Section>
          <Box
            paddingTop={{ mobile: 'large', desktop: 'medium' }}
            className={styles.linksContainer}
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
                            style={
                              activeHash === hash
                                ? {
                                    fontWeight: 'bold',
                                  }
                                : undefined
                            }
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
    </Fragment>
  );
};
