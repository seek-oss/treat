import { style } from 'treat';
import { Theme } from '../Theme';

const fabSize = 44;
export const fab = style({
  cursor: 'pointer',
  background: '#fff',
  height: fabSize,
  width: fabSize,
  borderRadius: fabSize,
  position: 'fixed',
  zIndex: 3,
  top: 16,
  right: 16,
  boxShadow: '0 4px 8px rgba(14, 14, 33, 0.2)',
  '@media': {
    'screen and (min-width: 1024px)': {
      display: 'none',
    },
  },
});

export const fab_isOpen = style({});

const barHeight = 3;
const barSpace = 4;
const barPosition = {
  1: fabSize / 2 - Math.floor(barHeight / 2) - barHeight - barSpace,
  2: fabSize / 2 - Math.floor(barHeight / 2),
  3: fabSize / 2 - Math.floor(barHeight / 2) + barHeight + barSpace,
};
export const fab__bar = style({
  position: 'absolute',
  left: 12,
  right: 12,
  height: 3,
  background: '#26232C',
  transition: 'transform .1s ease, opacity .1s ease',
  selectors: {
    '&:nth-child(1)': {
      top: barPosition['1'],
    },
    [`${fab_isOpen} &:nth-child(1)`]: {
      transform: `translateY(${barPosition['2'] -
        barPosition['1']}px) rotate(45deg)`,
    },
    '&:nth-child(2)': {
      top: barPosition['2'],
      left: 18,
    },
    [`${fab_isOpen} &:nth-child(2)`]: {
      opacity: 0,
    },
    '&:nth-child(3)': {
      top: barPosition['3'],
    },
    [`${fab_isOpen} &:nth-child(3)`]: {
      transform: `translateY(${barPosition['2'] -
        barPosition['3']}px) rotate(-45deg)`,
    },
  },
});

export const menu = style((theme: Theme) => ({
  background: theme.background.menu,
  backgroundAttachment: 'fixed',
  backgroundSize: 'cover',
  position: 'fixed',
  right: 0,
  bottom: 0,
  top: 0,
  width: '40vw',
  minWidth: '320px',
  zIndex: 2,
  overflow: 'auto',
  boxShadow: '0 0 40px rgba(14, 14, 33, 0.2)',
  transition: 'transform .15s ease, opacity .15s ease',
  '@media': {
    'screen and (min-width: 1024px)': {
      boxShadow: 'none',
      left: 0,
      right: 'auto',
      minWidth: 'auto',
      width: theme.columnWidth * 67,
    },
  },
}));

export const menu_isClosed = style({
  opacity: 0,
  pointerEvents: 'none',
  transform: 'translateX(12px)',
  '@media': {
    'screen and (min-width: 1024px)': {
      transform: 'none',
      pointerEvents: 'auto',
      opacity: 1,
    },
  },
});

export const menu_isOpen = style({
  opacity: 1,
  pointerEvents: 'auto',
  transform: 'none',
});

export const backdrop = style((theme: Theme) => ({
  position: 'fixed',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  background: theme.background.overlay,
  zIndex: 1,
  transition: 'opacity 0.1s ease',
  '@media': {
    'screen and (min-width: 1024px)': {
      pointerEvents: 'none',
      display: 'none',
    },
  },
}));

export const backdrop_isHidden = style({
  opacity: 0,
  pointerEvents: 'none',
});

export const backdrop_isVisible = style({
  opacity: 0.8,
  pointerEvents: 'auto',
});

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
