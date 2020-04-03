import {
  createTheme,
  style,
  styleMap,
  globalStyle,
  globalStyleSheet,
  Style,
} from 'treat';

interface Palette {
  primary: string;
  secondary: string;
}

interface Theme {
  name: string;
  breakpoint: number;
  palette: Palette;
}

const bigTheme = createTheme(
  {
    name: 'big_theme',
    breakpoint: 700,
    palette: {
      primary: 'blue',
      secondary: 'cyan',
    },
  },
  'big',
);

const smallTheme = createTheme(
  {
    name: 'small_theme',
    breakpoint: 1000,
    palette: {
      primary: 'red',
      secondary: 'magenta',
    },
  },
  'small',
);

const themedStyle = style(() => ({}));
const unthemedClassStyle = style({});

const lotsOfSelectors = breakpoint => ({
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

const palette = styleMap(({ palette }: Theme) =>
  (Object.keys(palette) as (keyof Palette)[]).reduce(
    (sheet, color) => ({
      ...sheet,
      [color]: {
        color: palette[color],
      },
    }),
    {} as Record<keyof Palette, Style>,
  ),
);

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

globalStyleSheet((theme: Theme) =>
  (Object.keys(theme.palette) as (keyof Palette)[]).reduce(
    (sheet, color) => ({
      ...sheet,
      [`${palette[color]} svg`]: {
        color: theme.palette[color],
      },
    }),
    {},
  ),
);

export default {
  blue: styles.blue,
  red,
  palette,
  bigTheme,
  smallTheme,
};
