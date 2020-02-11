import {style} from 'treat';
import {fontStack} from './fontStack';

const fg = 'deeppink';
const bg = 'white';

export const button = style({
  cursor: 'pointer',
  color: `${fg}`,
  fontFamily: fontStack,
  fontSize: '1em',
  border: `2px solid ${fg}`,
  borderRadius: '6px',
  backgroundColor: `${bg}`,
  padding: '0.5em 1em',
  ':hover': {
    opacity: 0.75
  },
  ':disabled': {
    cursor: 'default',
    opacity: 0.5
  }
});
