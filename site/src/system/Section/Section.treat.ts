import { style } from 'treat';
import { Theme } from '../../Theme';

export const root = style((theme: Theme) => ({
  margin: '0 auto',
  '@media': {
    'screen and (min-width: 1024px)': {
      maxWidth: theme.contentWidth,
    },
  },
}));
