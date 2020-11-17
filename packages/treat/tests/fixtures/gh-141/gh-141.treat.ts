import { style } from 'treat';

export default {
  foo: style(() => ({
    color: 'red',
  })),
  bar: style({
    fontSize: '55px',
  }),
};
