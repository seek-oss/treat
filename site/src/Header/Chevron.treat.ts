import { style } from 'treat';

export const root = style({
  transition: 'all .15s ease',
});

export const active = style({
  transform: 'rotate(180deg)',
});
