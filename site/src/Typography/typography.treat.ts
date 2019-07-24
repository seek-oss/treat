import { styleMap } from 'treat';
import { Theme } from '../Theme';
import basekick from 'basekick';

export const font = styleMap(({ headingFont, bodyFont }: Theme) => ({
  heading: { fontFamily: headingFont },
  body: { fontFamily: bodyFont },
}));

export const weight = styleMap((theme: Theme) => ({
  regular: { fontWeight: theme.weight.regular },
  strong: { fontWeight: theme.weight.strong },
}));

export const color = styleMap((theme: Theme) => ({
  strong: { color: theme.color.strong },
  neutral: { color: theme.color.neutral },
  code: { color: theme.color.code },
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
  copyType: 'heading' | 'body',
  textDefinition: Theme['text']['standard'],
  { rowHeight, headingDescenderHeightScale, bodyDescenderHeightScale }: Theme,
) => {
  const mobile = alignTextToGrid(
    textDefinition.mobile,
    rowHeight,
    copyType === 'heading'
      ? headingDescenderHeightScale
      : bodyDescenderHeightScale,
  );

  const desktop = alignTextToGrid(
    textDefinition.desktop,
    rowHeight,
    copyType === 'heading'
      ? headingDescenderHeightScale
      : bodyDescenderHeightScale,
  );

  return {
    fontSize: {
      fontSize: mobile.fontSize,
      lineHeight: mobile.lineHeight,
      '@media': {
        'screen and (min-width: 1024px)': {
          fontSize: desktop.fontSize,
          lineHeight: desktop.lineHeight,
        },
      },
    },
    transform: {
      transform: mobile.transform,
      '@media': {
        'screen and (min-width: 768px)': {
          transform: desktop.transform,
        },
      },
    },
  };
};

export const text = {
  standard: styleMap((theme: Theme) =>
    makeTypographyRules('body', theme.text.standard, theme),
  ),
  small: styleMap((theme: Theme) =>
    makeTypographyRules('body', theme.text.small, theme),
  ),
  xsmall: styleMap((theme: Theme) =>
    makeTypographyRules('body', theme.text.xsmall, theme),
  ),
  code: styleMap((theme: Theme) =>
    makeTypographyRules('body', theme.text.code, theme),
  ),
};

export const heading = {
  '1': styleMap((theme: Theme) =>
    makeTypographyRules('heading', theme.heading.h1, theme),
  ),
  '2': styleMap((theme: Theme) =>
    makeTypographyRules('heading', theme.heading.h2, theme),
  ),
  '3': styleMap((theme: Theme) =>
    makeTypographyRules('heading', theme.heading.h3, theme),
  ),
};
