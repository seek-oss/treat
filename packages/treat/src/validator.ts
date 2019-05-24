import joi, { Schema } from '@hapi/joi';
import { simplePseudos } from './transformCSS';

// type BasicCSSProperties = any;

// export interface CSSKeyframes {
//   [time: string]: BasicCSSProperties;
// }

// export type CSSProperties = BasicCSSProperties & {
//   '@keyframes'?: CSSKeyframes | string;
// };

// type PseudoStyles = { [key in SimplePseudos[number]]?: CSSProperties };

// type CSSPropertiesAndPseudos = CSSProperties & PseudoStyles;

// interface SelectorMap {
//   [selector: string]: CSSProperties;
// }

// export interface MediaQueries<StyleType> {
//   '@media'?: {
//     [query: string]: StyleType;
//   };
// }

// interface StylesWithSelectors extends CSSPropertiesAndPseudos {
//   selectors?: SelectorMap;
// }

// export type Styles = StylesWithSelectors & MediaQueries<StylesWithSelectors>;

const cssPropertiesSchema = joi
  .object()
  .pattern(joi.string(), [joi.string(), joi.number()]);

const keyframesSchema = joi.object().pattern(joi.string(), cssPropertiesSchema);

const cssWithKeyframesSchema = cssPropertiesSchema.append({
  '@keyframes': [joi.string(), keyframesSchema],
});

const cssWithSimplePseudos = cssWithKeyframesSchema.append(
  Object.assign(
    {},
    ...simplePseudos.map(pseudo => ({ [pseudo]: cssWithKeyframesSchema })),
  ),
);

const selectorsSchema = joi
  .object()
  .pattern(joi.string(), cssWithKeyframesSchema);

const cssWithSelectors = cssWithSimplePseudos.append({
  selectors: selectorsSchema,
});

const makeMediaQuerySchema = (valueSchema: Schema) => ({
  '@media': joi.object().pattern(joi.string(), valueSchema),
});

const globalStyle = cssWithKeyframesSchema.append(
  makeMediaQuerySchema(cssWithKeyframesSchema),
);

const fullStyle = cssWithSelectors.append(
  makeMediaQuerySchema(cssWithSelectors),
);

const validate = (handler: Schema) => (value: any, shouldThrow = true) => {
  const { error } = handler.validate(value);
  const valid = error === null;

  if (shouldThrow && !valid) {
    throw error;
  }

  return {
    valid: error === null,
    error,
  };
};

export const validateGlobalStyle = validate(globalStyle);

export const validateStyle = validate(fullStyle);
