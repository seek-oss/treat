import { css } from 'treat';

export const nonThemeStyles = css({
  yellow: {
    color: 'yellow',
  },
});

const someStyle = css(theme => ({
  button: {
    width: '400px',
    height: theme.rowHeight * 2,
    backgroundColor: theme.primaryColor,
  },
}));

export default {
  foo: {
    someStyle,
  },
};
