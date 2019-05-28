import { style } from 'treat';

interface Theme {
  primaryColor: string;
}

const themeStyle = style((theme: Theme) => ({
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
