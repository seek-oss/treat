const {
  validateGlobalStyle,
  validateStyle,
} = require('../lib/commonjs/validator');

describe('validator', () => {
  describe('validateGlobalStyle', () => {
    const validTests = [
      {},
      { display: 'block' },
      {
        color: 'red',
        '@media': { '(min-width: 800px)': { color: 'blue' } },
      },
      {
        '@keyframes': {
          from: {
            transform: 'scale(0)',
          },
          to: {
            transform: 'scale(1)',
          },
        },
      },
      {
        '@media': {
          '(min-width: 800px)': {
            '@keyframes': {
              from: {
                transform: 'scale(0)',
              },
              to: {
                transform: 'scale(1)',
              },
            },
          },
        },
      },
      {
        '@supports': {
          '(display: grid)': {
            display: 'flex',
          },
        },
      },
    ];

    it.each(validTests)('valid', value => {
      expect(() => validateGlobalStyle(value)).not.toThrow();
    });

    const invalidTests = [
      undefined,
      null,
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
      {
        '@keyframes': {
          from: {
            transform: 'scale(0)',
          },
          to: {
            transform: 'scale(1)',
          },
        },
      },
      {
        '@media': {
          '(min-width: 800px)': {
            '@keyframes': {
              from: {
                transform: 'scale(0)',
              },
              to: {
                transform: 'scale(1)',
              },
            },
          },
        },
      },
      {
        '@media': {
          '(min-width: 800px)': {
            selectors: {
              ['.someClass &']: {
                '@keyframes': {
                  from: {
                    transform: 'scale(0)',
                  },
                  to: {
                    transform: 'scale(1)',
                  },
                },
              },
            },
          },
        },
      },
      {
        '@supports': {
          '(display: grid)': {
            selectors: {
              ['.someClass &']: {
                display: 'grid',
              },
            },
          },
        },
      },
    ];

    it.each(validTests)('valid', value => {
      expect(() => validateStyle(value)).not.toThrow();
    });

    const invalidTests = [
      undefined,
      null,
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
      {
        selectors: {
          ['.someClass &']: {
            '@media': {
              '(min-width: 800px)': {
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
