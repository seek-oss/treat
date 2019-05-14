import { style } from 'treat';

const themeStyle = style(theme => ({
  backgroundColor: theme.primaryColor,
}));

const regularStyle = style({
  backgroundColor: 'white',
  display: 'flex',
  height: 100,
  width: 100,
});

export default {
  themeStyle,
  regularStyle,
};
