import { css } from 'treat';

export const nonThemeStyles = css({
  yellow: {
    color: 'yellow',
  },
});

export const foo = {
  someStyle: css(theme => ({
    button: {
      width: '400px',
      height: theme.rowHeight * 2,
      backgroundColor: theme.primaryColor,
    },
  })),
};
