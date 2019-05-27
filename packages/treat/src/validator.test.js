const {
  validateGlobalStyle,
  validateStyle,
} = require('../lib/commonjs/validator');

describe('validator', () => {
  describe('validateGlobalStyle', () => {
    const validTests = [
      {},
      { display: 'block' },
      { color: 'red', '@media': { '(min-width: 800px)': { color: 'blue' } } },
    ];

    it.each(validTests)('valid', value => {
      expect(() => validateGlobalStyle(value)).not.toThrow();
    });

    const invalidTests = [
      2,
      {
        '@media': { color: 'blue' },
      },
      {
        media: { '(min-width: 800px)': { color: 'blue' } },
      },
      {
        ':hover': { color: 'blue' },
      },
      {
        '@media': {
          '(min-width: 800px)': {
            '@media': { '(min-width: 800px)': { color: 'blue' } },
          },
        },
      },
      {
        '@media': {
          '(min-width: 800px)': {
            ':hover': {
              color: 'blue',
            },
          },
        },
      },
      {
        selectors: {
          ['.someClass &']: {
            color: 'red',
          },
        },
      },
    ];

    it.each(invalidTests)('invalid', value => {
      expect(() => validateGlobalStyle(value)).toThrow();
    });
  });

  describe('validateStyle', () => {
    const validTests = [
      {},
      { display: 'block' },
      {
        color: 'red',
        '@media': { '(min-width: 800px)': { color: 'blue' } },
      },
      {
        ':hover': { color: 'blue' },
      },
      {
        '@media': {
          '(min-width: 800px)': {
            ':hover': {
              color: 'blue',
            },
          },
        },
      },
      {
        '@media': {
          '(min-width: 800px)': {
            selectors: {
              '.someClass &': {
                color: 'blue',
              },
            },
          },
        },
      },
      {
        selectors: {
          ['.someClass &']: {
            color: 'red',
          },
        },
      },
    ];

    it.each(validTests)('valid', value => {
      expect(() => validateStyle(value)).not.toThrow();
    });

    const invalidTests = [
      2,
      {
        '@media': { color: 'blue' },
      },
      {
        media: { '(min-width: 800px)': { color: 'blue' } },
      },
      {
        '@media': {
          '(min-width: 800px)': {
            '@media': { '(min-width: 800px)': { color: 'blue' } },
          },
        },
      },
      {
        selectos: {
          ['.someClass &']: {
            color: 'red',
          },
        },
      },
      {
        selectors: {
          ['.someClass &']: {
            ':hover': {
              color: 'red',
            },
          },
        },
      },
      {
        selectors: {
          '.someClass &': {
            selectors: {
              '.someOtherClass &': {
                color: 'red',
              },
            },
          },
        },
      },
    ];

    it.each(invalidTests)('invalid', value => {
      expect(() => validateStyle(value)).toThrow();
    });
  });
});
