import { style } from 'treat';
import { Theme } from '../Theme';

export const root = style((theme: Theme) => ({
  background: theme.background.menu,
  position: 'fixed',
  left: 0,
  top: 0,
  width: '100%',
  zIndex: 1,
  '@media': {
    'screen and (min-width: 1024px)': {
      width: theme.columnWidth * 65,
      height: '100vh',
      overflow: 'auto',
    },
  },
}));

export const logoContainer = style({
  cursor: 'pointer',
  alignItems: 'center',
  '@media': {
    'screen and (min-width: 1024px)': {
      cursor: 'auto',
    },
  },
});

export const chevron = style({
  position: 'relative',
  top: 2,
  left: 12,
  '@media': {
    'screen and (min-width: 1024px)': {
      display: 'none',
    },
  },
});

export const linksContainer = style({
  '@media': {
    'screen and (min-width: 1024px)': {
      display: 'block !important',
    },
  },
});

export const links = style({
  display: 'flex',
  flexDirection: 'column',
});

export const subLink = style({
  textDecoration: 'none',
});
