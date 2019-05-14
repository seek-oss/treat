module.exports = class TreatError extends Error {
  constructor(error) {
    super(
      `treat-plugin: An error occured during compilation: \n${error.stack}`,
    );

    this.name = 'TreatError';

    Error.captureStackTrace(this, this.constructor);
  }
};
