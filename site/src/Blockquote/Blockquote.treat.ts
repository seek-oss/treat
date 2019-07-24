import { style } from 'treat';
import { Theme } from '../Theme';

export const root = style((theme: Theme) => ({
  borderLeft: `${theme.border.standard}px solid ${theme.color.neutral}`,
  background: theme.background.note,
}));
