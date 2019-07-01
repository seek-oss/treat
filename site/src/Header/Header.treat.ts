import { style } from 'treat';
import { Theme } from '../Theme';

export const root = style((theme: Theme) => ({
  position: 'sticky',
  top: theme.rowHeight * 6,
}));
