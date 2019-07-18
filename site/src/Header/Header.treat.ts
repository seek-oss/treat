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
  zIndex: 2,
  top: 12,
  right: 18,
  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
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
  position: 'fixed',
  left: 0,
  bottom: 0,
  top: 0,
  width: '100%',
  zIndex: 1,
  overflow: 'auto',
  transition: 'transform .15s ease, opacity .15s ease',
  '@media': {
    'screen and (min-width: 1024px)': {
      width: theme.columnWidth * 65,
    },
  },
}));

export const menu_isClosed = style({
  opacity: 0,
  pointerEvents: 'none',
  transform: 'translateY(-8px)',
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
