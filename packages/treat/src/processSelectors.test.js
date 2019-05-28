const { combinedThemeSelector } = require('../lib/commonjs/processSelectors');

describe('combinedThemeSelector', () => {
  describe('single theme', () => {
    const themes = [{ themeRef: '_singleTheme' }];
    const tests = [
      ['html', 'html'],
      ['html .someClass', 'html .someClass'],
      ['$themedClass *', '.themedClass_singleTheme *'],
      [
        '$themedClass .someClass, h1',
        '.themedClass_singleTheme .someClass, h1',
      ],
      [
        '$themedClass .someClass, $themedClass div',
        '.themedClass_singleTheme .someClass, .themedClass_singleTheme div',
      ],
    ];

    it.each(tests)('should support "%s"', (value, expected) => {
      expect(combinedThemeSelector(value, themes)).toBe(expected);
    });
  });

  describe('multiple themes', () => {
    const themes = [{ themeRef: '_themeOne' }, { themeRef: '_themeTwo' }];
    const tests = [
      ['html', 'html'],
      ['html .someClass', 'html .someClass'],
      ['$themedClass *', '.themedClass_themeOne *, .themedClass_themeTwo *'],
      [
        '$themedClass .someClass, h1',
        '.themedClass_themeOne .someClass, .themedClass_themeTwo .someClass, h1',
      ],
      [
        '$themedClass .someClass, $themedClass div',
        '.themedClass_themeOne .someClass, .themedClass_themeTwo .someClass, .themedClass_themeOne div, .themedClass_themeTwo div',
      ],
      [
        '$themedClass .someClass, $themedClass $otherThemedClass',
        '.themedClass_themeOne .someClass, .themedClass_themeTwo .someClass, .themedClass_themeOne .otherThemedClass_themeOne, .themedClass_themeTwo .otherThemedClass_themeTwo',
      ],
    ];

    it.each(tests)('should support "%s"', (value, expected) => {
      expect(combinedThemeSelector(value, themes)).toBe(expected);
    });
  });
});
