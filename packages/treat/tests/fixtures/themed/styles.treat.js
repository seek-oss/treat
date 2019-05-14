import { style } from 'treat';

const themeStyle = style(
  theme => ({
    backgroundColor: theme.primaryColor,
  }),
  'themeStyle',
);

const regularStyle = style(
  {
    backgroundColor: 'white',
    display: 'flex',
  },
  'regularStyle',
);

export default {
  themeStyle,
  regularStyle,
};
