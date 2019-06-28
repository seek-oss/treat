import { style } from 'treat';
import { Theme } from '../../Theme';

export const root = style((theme: Theme) => ({
  width: theme.columnWidth * 20,
  height: theme.rowHeight * 5,
  padding: theme.rowHeight,
  border: '1px solid grey',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));
