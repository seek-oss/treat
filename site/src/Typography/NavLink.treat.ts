import { style } from 'treat';
import { Theme } from '../Theme';

export const link = style((theme: Theme) => ({
  textTransform: 'uppercase',
  color: theme.color.strong,
  fontWeight: 'bold',
  textDecoration: 'none',
  ':hover': {
    textDecoration: 'underline',
  },
}));

export const active = style((theme: Theme) => ({
  fontWeight: theme.weight.strong,
}));
