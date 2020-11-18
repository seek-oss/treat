import { styleMap, globalStyle, globalStyleSheet } from 'treat';

globalStyle('html, body', {
  backgroundColor: 'pink',
});

const styles = styleMap(
  {
    blue: {
      height: 100,
      width: 100,
      color: 'blue',
      display: 'flex',
      ':hover': {
        backgroundColor: 'purple',
      },
    },
    red: {
      color: 'red',
      '@media': {
        'screen and (min-width: 700px)': {
          color: 'green',
        },
      },
      selectors: {
        'body &': {
          zIndex: 2,
        },
      },
    },
  },
  'mainStyles',
);

globalStyle(`html ${styles.blue}`, {
  position: 'absolute',
});

globalStyleSheet({
  [`strong${styles.blue}`]: {
    opacity: 0.8,
  },
  [`strong${styles.red}`]: {
    fontWeight: 'bolder',
  },
});

export default styles;
