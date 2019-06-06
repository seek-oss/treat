import { styleMap, CSSProperties } from 'treat';
import mapValues from 'lodash/mapValues';
import { DesignTokens } from './DesignTokens';
import { mapToStyleProperty } from './mapToStyleProperty';

export function createSpacing<
  Spacing extends string,
  Breakpoint extends string
>({ grid, spacing, breakpoints }: DesignTokens<Spacing, Breakpoint>) {
  const makeSpacingRules = (property: keyof CSSProperties) =>
    mapValues(breakpoints, (minWidth, breakpointName) => ({
      [breakpointName]: styleMap(
        mapToStyleProperty(spacing, property, minWidth, x => x * grid),
      ),
    }));

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
