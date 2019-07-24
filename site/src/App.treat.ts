import { globalStyle, style } from 'treat';
import { Theme } from './Theme';

globalStyle('html, body', { margin: 0, padding: 0 });

export const content = style((theme: Theme) => ({
  '@media': {
    'screen and (min-width: 1024px)': {
      paddingLeft: theme.columnWidth * 67,
    },
  },
}));
