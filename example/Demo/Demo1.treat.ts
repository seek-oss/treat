import { css, style } from 'treat';

export const nonThemeStyles = css({
  yellow: {
    color: 'yellow',
  },
  hide: {
    display: 'none',
  },
});

export const foo = {
  someStyle: css(theme => ({
    button: {
      width: '400px',
      height: theme.rowHeight,
      backgroundColor: theme.primaryColor,

      '@media': {
        'screen and (min-width: 740px)': {
          selectors: {
            '&:hover': {
              outline: '2px solid pink',
            },
          },
        },
      },

      selectors: {
        '&:hover': {
          color: 'red',
        },
      },
    },
  })),
};

export const courier = style({
  fontFamily: 'courier',
});

export const strong = style(theme => ({
  fontWeight: theme.strong,
}));
