import { style } from 'treat';

export default style({
  display: 'block',
  '@supports': {
    '(display: grid)': {
      display: 'grid',
    },
    'not (display: grid)': {
      display: 'flex',
    },
  },
});
