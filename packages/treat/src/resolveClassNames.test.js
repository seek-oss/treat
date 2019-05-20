const { resolveClassNames } = require('treat');

const themeRef = '_theme';

describe('resolveClassNames', () => {
  it('should handle dereference themed classes', () => {
    expect(resolveClassNames(themeRef, '$someClass')).toBe('someClass_theme');
  });

  it('should handle regular classes', () => {
    expect(resolveClassNames(themeRef, 'someClass')).toBe('someClass');
  });

  it('should handle arrays', () => {
    const value = ['$someClass', 'someOtherClass'];

    expect(resolveClassNames(themeRef, value)).toBe(
      'someClass_theme someOtherClass',
    );
  });

  it('should handle objects', () => {
    const value = { ['$someClass']: true, someOtherClass: true };

    expect(resolveClassNames(themeRef, value)).toBe(
      'someClass_theme someOtherClass',
    );
  });

  it('should handle objects with falsy values', () => {
    const value = { $someClass: false, someOtherClass: true };

    expect(resolveClassNames(themeRef, value)).toBe('someOtherClass');
  });
});
