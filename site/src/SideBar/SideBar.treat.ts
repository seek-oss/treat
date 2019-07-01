import { style } from 'treat';
import { Theme } from '../Theme';

export const root = style((theme: Theme) => ({
  paddingTop: theme.rowHeight * 14,
}));

export const links = style({
  display: 'flex',
  flexDirection: 'column',
});
