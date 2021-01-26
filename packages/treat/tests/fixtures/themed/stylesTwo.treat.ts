import { style } from 'treat';

const themeStyle = style((theme) => ({
  height: theme.row * 2,
}));

const regularStyle = style({
  zIndex: 2,
});

export default {
  themeStyle,
  regularStyle,
};
