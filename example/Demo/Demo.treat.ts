import { css, style } from 'treat';

export const nonThemeStyles = css({
  yellow: {
    color: 'yellow',
  },
  hide: {
    display: 'none',
  },
});

const someStyle = css(theme => ({
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
}));

const courier = style({
  fontFamily: 'courier',
});

const strong = style(theme => ({
  fontWeight: theme.strong,
}));

export default {
  foo: {
    someStyle,
  },
  courier,
  strong,
};
