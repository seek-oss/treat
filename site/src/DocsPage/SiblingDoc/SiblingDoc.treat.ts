import { style } from 'treat';

export const root = style(theme => ({
  width: theme.columnWidth * 20,
  height: theme.rowHeight * 5,
  padding: theme.rowHeight,
  border: '1px solid grey',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));
