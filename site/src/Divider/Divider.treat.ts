import { style } from 'treat';
import { Theme } from '../Theme';

export const root = style({ position: 'relative' });

export const divider = style((theme: Theme) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: 2,
  background: theme.background.divider,
}));
