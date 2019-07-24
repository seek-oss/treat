import { style } from 'treat';

export const root = style({
  transition: 'all .15s ease',
});

export const direction = {
  down: null,
  up: style({ transform: 'rotate(180deg)' }),
  left: style({ transform: 'rotate(90deg)' }),
  right: style({ transform: 'rotate(270deg)' }),
};
