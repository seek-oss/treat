import { style } from 'treat';
import { Theme } from '../Theme';

export const root = style((theme: Theme) => ({
  background: theme.background.screen,
  position: 'fixed',
  top: 0,
  width: '100%',
  zIndex: 1,
  transition: 'all .3s ease',
}));

export const sticky = style({
  boxShadow: '0 0 10px rgba(0,0,0,0.1)',
});

export const logoContainer = style({
  cursor: 'pointer',
  alignItems: 'center',
});

export const chevron = style({
  position: 'relative',
  top: 2,
  left: 12,
});

export const links = style({
  display: 'flex',
  flexDirection: 'column',
});
