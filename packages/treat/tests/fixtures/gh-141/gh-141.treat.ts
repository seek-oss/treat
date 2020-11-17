import { style, createTheme } from 'treat';

export const theme = createTheme({
  name: 'yellow',
  primaryColor: 'yellow',
});

export default {
  foo: style(() => ({
    color: 'red',
  })),
  bar: style({
    fontSize: '55px',
  }),
};
