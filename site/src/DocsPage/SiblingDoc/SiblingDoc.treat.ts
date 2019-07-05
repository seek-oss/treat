import { style } from 'treat';
import { Theme } from '../../Theme';

export const root = style((theme: Theme) => ({
  height: theme.rowHeight * 5,
  padding: theme.rowHeight,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));
