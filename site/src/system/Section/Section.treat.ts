import { style } from 'treat';
import { Theme } from '../../Theme';

export const root = style((theme: Theme) => ({
  maxWidth: theme.contentWidth,
  margin: '0 auto',
}));
