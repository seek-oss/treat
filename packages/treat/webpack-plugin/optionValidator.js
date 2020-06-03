const joi = require('@hapi/joi');

const schema = joi.object({
  test: joi.any(),
  outputCSS: joi.boolean(),
  outputLoaders: joi.array().items(joi.any()),
  localIdentName: joi.string(),
  themeIdentName: [joi.func(), joi.string()],
  minify: joi.boolean(),
  browsers: [joi.string(), joi.array().items(joi.string())],
  verbose: joi.boolean(),
});

class ValidationError extends Error {
  constructor(error) {
    super();

    this.name = 'treat-webpack-plugin: Invalid options passed to treat plugin';

    this.message = `\n${error.annotate()}\n`;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = options => {
  const { error } = schema.validate(options);

  if (error) {
    throw new ValidationError(error);
  }
};
