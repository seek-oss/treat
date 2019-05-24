import { style, styleMap } from 'treat';
import { Theme } from 'treat/theme';
import basekick from 'basekick';

export const fontFamily = style(({ fontFamily }) => ({
  fontFamily,
}));

interface TextDefinition {
  rows: number;
  size: number;
}

const alignTextToGrid = (
  textDefinition: TextDefinition,
  gridRowHeight: number,
  descenderHeightScale: number,
) =>
  basekick({
    baseFontSize: 1,
    typeSizeModifier: textDefinition.size,
    typeRowSpan: textDefinition.rows,
    gridRowHeight,
    descenderHeightScale,
  });

const makeTypographyRules = (
  textDefinition: {
    size: number;
    rows: number;
  },
  { rowHeight, descenderHeightScale }: Theme,
) => {
  const { fontSize, lineHeight, transform } = alignTextToGrid(
    textDefinition,
    rowHeight,
    descenderHeightScale,
  );

  return {
    fontSize: {
      fontSize,
      lineHeight,
    },
    transform: {
      transform,
    },
  };
};

export const text = {
  standard: styleMap(theme => makeTypographyRules(theme.text.standard, theme)),
};

export const heading = {
  '1': styleMap(theme => makeTypographyRules(theme.heading.h1, theme)),
  '2': styleMap(theme => makeTypographyRules(theme.heading.h2, theme)),
  '3': styleMap(theme => makeTypographyRules(theme.heading.h3, theme)),
};
