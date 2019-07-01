import { style } from 'treat';
import { Theme } from '../Theme';

export const link = style((theme: Theme) => ({
  color: theme.color.neutral,
  textDecoration: 'none',
  ':hover': {
    textDecoration: 'underline',
  },
}));

export const active = style((theme: Theme) => ({
  fontWeight: theme.weight.strong,
  textDecoration: 'underline',
}));
