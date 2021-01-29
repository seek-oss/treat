import { style } from 'treat';

const themeStyle = style((theme) => ({
  backgroundColor: theme.primaryColor,
}));

const regularStyle = style({
  zIndex: 1,
  display: 'flex',
});

export default {
  themeStyle,
  regularStyle,
};
