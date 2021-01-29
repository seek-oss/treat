import { createTheme, style, styleMap, globalStyle } from 'treat';

interface Theme {
  name: string;
  breakpoint: number;
}

const bigTheme = createTheme(
  {
    name: 'big_theme',
    breakpoint: 700,
  },
  'big',
);

const smallTheme = createTheme(
  {
    name: 'small_theme',
    breakpoint: 1000,
  },
  'small',
);

const themedStyle = style(() => ({}));
const unthemedClassStyle = style({});

const lotsOfSelectors = (breakpoint: number) => ({
  ':focus': {
    color: 'purple',
  },
  '@media': {
    [`screen and (min-width: ${breakpoint}px)`]: {
      color: 'green',
      selectors: {
        [`${unthemedClassStyle} &`]: {
          color: 'red',
        },
        [`${themedStyle} &`]: {
          color: 'blue',
        },
        [`${themedStyle} ${unthemedClassStyle} &`]: {
          color: 'black',
        },
      },
    },
  },
  selectors: {
    [`${unthemedClassStyle} &`]: {
      backgroundColor: 'red',
    },
    [`${themedStyle} &`]: {
      backgroundColor: 'blue',
    },
    [`${themedStyle} ${unthemedClassStyle} &`]: {
      backgroundColor: 'black',
    },
  },
});

const styles = styleMap({
  blue: lotsOfSelectors(300),
});

const red = style((theme: Theme) => lotsOfSelectors(theme.breakpoint));

globalStyle(`html ${styles.blue}`, {
  position: 'absolute',
  '@media': {
    'screen and (min-width: 700px)': {
      position: 'relative',
    },
  },
});

globalStyle(`html ${red}`, (theme: Theme) => ({
  position: 'absolute',
  '@media': {
    [`screen and (min-width: ${theme.breakpoint + 1}px)`]: {
      position: 'relative',
    },
  },
}));

export default {
  blue: styles.blue,
  red,
  bigTheme,
  smallTheme,
};
