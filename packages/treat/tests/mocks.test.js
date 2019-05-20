const {
  createTheme,
  style,
  styleMap,
  resolveClassNames,
  resolveStyles,
} = require('treat');

describe('Mocks', () => {
  describe('With debug names', () => {
    let testTheme1;
    let testTheme2;

    beforeAll(() => {
      testTheme1 = createTheme({ name: 'testTheme1' }, 'testTheme1');
      testTheme2 = createTheme({ name: 'testTheme2' }, 'testTheme2');
    });

    describe('Unthemed', () => {
      it('Should support unthemed styles', () => {
        const themedStyleRef = style({ color: 'red' }, 'unthemedStyle');
        const className = resolveClassNames(testTheme1, themedStyleRef);
        expect(className).toBe('unthemedStyle');
      });

      it('Should support unthemed styleMap', () => {
        const themedStyles = styleMap(
          {
            red: { color: 'red' },
          },
          'unthemedStyleMap',
        );

        const styles = resolveStyles(testTheme1, themedStyles);
        expect(styles.red).toBe('unthemedStyleMap_red');
      });
    });

    describe('Themed', () => {
      it('Should support themed styles', () => {
        const themedStyleRef = style(() => ({ color: 'red' }), 'themedStyle');

        const className1 = resolveClassNames(testTheme1, themedStyleRef);
        expect(className1).toBe('themedStyle_testTheme1');

        const className2 = resolveClassNames(testTheme2, themedStyleRef);
        expect(className2).toBe('themedStyle_testTheme2');
      });

      it('Should support themed styleMap', () => {
        const themedStyles = styleMap(
          () => ({
            red: { color: 'red' },
          }),
          'themedStyleMap',
        );

        const styles1 = resolveStyles(testTheme1, themedStyles);
        expect(styles1.red).toBe('themedStyleMap_red_testTheme1');

        const styles2 = resolveStyles(testTheme2, themedStyles);
        expect(styles2.red).toBe('themedStyleMap_red_testTheme2');
      });
    });
  });

  describe('Without debug names', () => {
    let testTheme1;
    let testTheme2;

    beforeAll(() => {
      testTheme1 = createTheme({ name: 'testTheme1' });
      testTheme2 = createTheme({ name: 'testTheme2' });
    });

    describe('Unthemed', () => {
      it('Should support unthemed styles', () => {
        const themedStyleRef = style({ color: 'red' });
        const className = resolveClassNames(testTheme1, themedStyleRef);
        expect(className).toBe('style');
      });

      it('Should support unthemed styleMap', () => {
        const themedStyles = styleMap({
          red: { color: 'red' },
        });

        const styles = resolveStyles(testTheme1, themedStyles);
        expect(styles.red).toBe('red');
      });
    });

    describe('Themed', () => {
      it('Should support themed styles', () => {
        const themedStyleRef = style(() => ({ color: 'red' }));

        const className1 = resolveClassNames(testTheme1, themedStyleRef);
        expect(className1).toBe('style_theme');

        const className2 = resolveClassNames(testTheme2, themedStyleRef);
        expect(className2).toBe('style_theme');
      });

      it('Should support themed styleMap', () => {
        const themedStyles = styleMap(() => ({
          red: { color: 'red' },
        }));

        const styles1 = resolveStyles(testTheme1, themedStyles);
        expect(styles1.red).toBe('red_theme');

        const styles2 = resolveStyles(testTheme2, themedStyles);
        expect(styles2.red).toBe('red_theme');
      });
    });
  });
});
