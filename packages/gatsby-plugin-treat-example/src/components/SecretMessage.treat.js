import {style} from 'treat';
import {fontStack} from './fontStack';

export const mesage = style({
    fontFamily: fontStack
});

export const emoji = style({
    display: 'inline-block',
    fontSize: '3em',
    selectors: {
        '& + &': {
            marginLeft: '1rem'
        }
    }
});
