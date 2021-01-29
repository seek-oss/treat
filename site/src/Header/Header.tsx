import React, { useState, Fragment, MouseEvent, ReactNode } from 'react';
import { useStyles } from 'react-treat';
import classnames from 'classnames';
import { Box, Section } from '../system';
import NavLink from '../Typography/NavLink';
import docs from '../docs-store';
import Link from '../Typography/Link';
import { useActiveHash } from '../useHeadingRoute';
import * as styleRefs from './Header.treat';

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

const NavSection = ({
  href,
  title,
  children,
  onClick,
}: {
  href: string;
  title: string;
  children: ReactNode;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}) => (
  <Fragment>
    <Box paddingBottom="xsmall">
      <NavLink size="xsmall" to={href} exact onClick={onClick}>
        {title}
      </NavLink>
    </Box>
    <Box paddingBottom="large">{children}</Box>
  </Fragment>
);

const SubLink = ({
  children,
  to,
  hash,
  active,
  onClick,
}: {
  children: ReactNode;
  to: string;
  hash?: string;
  active?: boolean;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}) => {
  const styles = useStyles(styleRefs);

  return (
    <Box className={styles.subLinkContainer} paddingLeft="medium" key={hash}>
      {active ? <div className={styles.activeSubLinkBar} /> : null}
      <Link
        size="small"
        to={`${to}${hash ? `#${hash}` : ''}`}
        onClick={onClick}
        className={styles.subLink}
        style={
          active
            ? {
                fontWeight: 'bold',
              }
            : undefined
        }
      >
        {children}
      </Link>
    </Box>
  );
};

export default () => {
  const styles = useStyles(styleRefs);
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen((open) => !open);
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
            paddingLeft={{ mobile: 'medium', desktop: 'none' }}
            className={styles.linksContainer}
          >
            <div className={styles.links}>
              {docs.map(({ title, route, sections }) => (
                <Fragment key={route}>
                  <NavSection
                    title={title}
                    href={route}
                    onClick={closeMenuAndScrollToTop}
                  >
                    {sections
                      .filter(({ level }) => level === 2)
                      .map(({ hash, name }) => (
                        <SubLink
                          key={name}
                          to={route}
                          hash={hash}
                          active={hash === activeHash}
                          onClick={closeMenu}
                        >
                          {name}
                        </SubLink>
                      ))}
                  </NavSection>
                </Fragment>
              ))}
              <NavSection
                title="Community"
                href="https://www.github.com/seek-oss/treat"
              >
                <SubLink to="https://www.github.com/seek-oss/treat">
                  GitHub
                </SubLink>
                <SubLink to="https://spectrum.chat/treatcss">Spectrum</SubLink>
              </NavSection>
            </div>
          </Box>
        </Section>
      </Box>
    </Fragment>
  );
};
