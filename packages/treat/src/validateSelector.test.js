const { validateSelector } = require('../lib/commonjs/validateSelector');

describe('validateSelector', () => {
  describe('valid selectors', () => {
    const validSelectors = [
      '&',
      '& &',
      '.foo &',
      '[foo] &',
      '& .foo &',
      '.foo ~ .bar &',
      '.foo + .bar &',
      '.foo > .bar &',
      '&:hover',
      '&:not(:disabled)',
      '&.foo',
      '&.foo.bar',
      '.foo&',
      '.foo.bar&',
      '.foo.bar.baz&',
      '&.foo:hover',
      '&.foo.bar:hover',
      '&.foo.bar:not(.baz)',
      '.foo &:not(:disabled)',
      '.foo ~ .bar > &:not(:disabled)',
    ];
    it.each(validSelectors)('should support %s', selector => {
      expect(() => validateSelector(selector)).not.toThrow();
    });
  });

  describe('invalid selectors', () => {
    const invalidSelectors = [
      '& .foo',
      '& [foo]',
      '& .foo .bar',
      '& .foo .bar .baz',
      '.foo & .bar',
      '& :hover',
      '.foo & :hover',
      '& > :hover',
      '.foo & > :hover',
      '.foo & ~ .foo > .bar + baz',
    ];
    it.each(invalidSelectors)('should not support %s', selector => {
      expect(() => validateSelector(selector)).toThrow();
    });
  });

  describe('invalid selectors', () => {
    const invalidSelectors = ['!', '123', ' ', '=', '{}'];
    it.each(invalidSelectors)('should not support %s', selector => {
      expect(() => validateSelector(selector)).toThrow();
    });
  });
});
