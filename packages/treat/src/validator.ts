import joi, { Schema, ObjectSchema } from '@hapi/joi';
import { simplePseudos } from './transformCSS';

const cssPropertiesSchema = joi
  .object()
  .pattern(joi.string().regex(/^[^:@]/), [joi.string(), joi.number()]);

const keyframesSchema = joi.object().pattern(joi.string(), cssPropertiesSchema);

const cssWithKeyframesSchema = cssPropertiesSchema.append({
  '@keyframes': [joi.string(), keyframesSchema],
});

const cssWithSimplePseudos = cssWithKeyframesSchema.append(
  Object.assign(
    {},
    ...simplePseudos.map((pseudo) => ({ [pseudo]: cssWithKeyframesSchema })),
  ),
);

const selectorsSchema = joi
  .object()
  .pattern(joi.string(), cssWithKeyframesSchema);

const fullStyle = cssWithSimplePseudos.append({
  selectors: selectorsSchema,
});

const makeQuerySchema = (valueSchema: ObjectSchema) =>
  valueSchema
    .append({
      '@media': joi.object().pattern(joi.string(), valueSchema),
    })
    .append({
      '@supports': joi.object().pattern(joi.string(), valueSchema),
    });

const fullStyleWithMedia = makeQuerySchema(fullStyle).required();

const globalStyleWithMedia = makeQuerySchema(
  fullStyle.fork(['selectors', ...simplePseudos], (a) => a.forbidden()),
).required();

const validate = (handler: Schema) => (value: any) => {
  const { error } = handler.validate(value);

  if (error) {
    throw error;
  }
};

export const validateGlobalStyle = validate(globalStyleWithMedia);

export const validateStyle = validate(fullStyleWithMedia);
