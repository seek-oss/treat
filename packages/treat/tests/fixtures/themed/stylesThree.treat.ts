import { style } from 'treat';

const themeStyle = style(theme => ({
  lineHeight: theme.row,
}));

const regularStyle = style({
  zIndex: 3,
});

export default {
  themeStyle,
  regularStyle,
};
