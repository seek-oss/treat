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

  return {
    paddingTop: makeSpacingRules('paddingTop'),
    paddingBottom: makeSpacingRules('paddingBottom'),
    paddingLeft: makeSpacingRules('paddingLeft'),
    paddingRight: makeSpacingRules('paddingRight'),
    marginTop: makeSpacingRules('marginTop'),
    marginBottom: makeSpacingRules('marginBottom'),
    marginLeft: makeSpacingRules('marginLeft'),
    marginRight: makeSpacingRules('marginRight'),
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
