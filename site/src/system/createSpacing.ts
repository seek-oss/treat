import { style, styleTree, CSSProperties } from 'treat';
import mapValues from 'lodash/mapValues';
import { Tokens, StyleFn } from './types';
import { responsiveStyles } from './responsiveStyles';

export function createSpacing<Space extends string, Breakpoint extends string>(
  tokens: Tokens<Space, Breakpoint>,
  styleFn: StyleFn = style,
) {
  const makeSpacingRules = (property: keyof CSSProperties) =>
    mapValues(tokens.spacing, space =>
      mapValues(tokens.breakpoints, (minWidth, breakpoint) =>
        styleFn(
          responsiveStyles(minWidth, { [property]: space * tokens.grid }),
          `${property}_${space}_${breakpoint}`,
        ),
      ),
    );

  const padding = {
    top: makeSpacingRules('paddingTop'),
    bottom: makeSpacingRules('paddingBottom'),
    left: makeSpacingRules('paddingLeft'),
    right: makeSpacingRules('paddingRight'),
  };

  const margin = {
    top: makeSpacingRules('marginTop'),
    bottom: makeSpacingRules('marginBottom'),
    left: makeSpacingRules('marginLeft'),
    right: makeSpacingRules('marginRight'),
  };

  return {
    padding,
    margin,
  };
}

export function createSpacingThemed<
  Space extends string,
  Breakpoint extends string,
  UserTheme extends Tokens<Space, Breakpoint>
>() {
  return styleTree((theme: UserTheme, styleNode) =>
    createSpacing(theme, styleNode),
  );
}
