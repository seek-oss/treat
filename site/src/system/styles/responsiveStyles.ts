import { CSSProperties } from 'treat';

export const responsiveStyles = (minWidth: number, styles: CSSProperties) =>
  minWidth > 0
    ? {
        '@media': {
          [`screen and (min-width: ${minWidth})`]: styles,
        },
      }
    : styles;
