import { style } from 'treat';

export const root = style({
  display: 'block',
  position: 'relative',
  top: -80,
  visibility: 'hidden',
  '@media': {
    'screen and (min-width: 1024px)': {
      top: 0,
    },
  },
});
