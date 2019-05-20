const babel = require('@babel/core');
const plugin = require('.');

const transform = (source, options = {}, filename = '/mockFilename.treat.js') =>
  babel.transformSync(source, {
    filename,
    plugins: [[plugin, options]],
  }).code;

describe('babel plugin', () => {
  it('should handle style assigned to const', () => {
    const source = `
        import { style } from 'treat';

        const one = style({
            zIndex: 2,
        });
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
                  "import { style } from 'treat';
                  const one = style({
                    zIndex: 2
                  }, \\"one\\");"
            `);
  });

  it('should handle style assigned to default export', () => {
    const source = `
        import { style } from 'treat';

        export default style({
            zIndex: 2,
        });
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
                  "import { style } from 'treat';
                  export default style({
                    zIndex: 2
                  }, \\"mockFilename\\");"
            `);
  });

  it('should handle style assigned to default export in index.js file', () => {
    const source = `
        import { style } from 'treat';

        export default style({
            zIndex: 2,
        });
    `;

    expect(transform(source, {}, '/someFolder/index.js'))
      .toMatchInlineSnapshot(`
      "import { style } from 'treat';
      export default style({
        zIndex: 2
      }, \\"someFolder\\");"
    `);
  });

  it('should handle style assigned to object property', () => {
    const source = `
        import { style } from 'treat';

        const test = {
          two: style({
            zIndex: 2,
          })
        };
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
                  "import { style } from 'treat';
                  const test = {
                    two: style({
                      zIndex: 2
                    }, \\"two\\")
                  };"
            `);
  });

  it('should handle styleMap assigned to const', () => {
    const source = `
       import { styleMap } from 'treat';

        const three = styleMap({
            testStyle: {
              zIndex: 2,
            }
        });
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
                  "import { styleMap } from 'treat';
                  const three = styleMap({
                    testStyle: {
                      zIndex: 2
                    }
                  }, \\"three\\");"
            `);
  });

  it('should handle createTheme assigned to const', () => {
    const source = `
       import { createTheme } from 'treat';

       const darkTheme = createTheme({});
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
            "import { createTheme } from 'treat';
            const darkTheme = createTheme({}, \\"darkTheme\\");"
        `);
  });

  it('should ignore functions that already supply a debug name', () => {
    const source = `
       import { styleMap } from 'treat';

        const three = styleMap({
            testStyle: {
              zIndex: 2,
            }
        }, 'myDebugValue');
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
                  "import { styleMap } from 'treat';
                  const three = styleMap({
                    testStyle: {
                      zIndex: 2
                    }
                  }, 'myDebugValue');"
            `);
  });

  it('should only apply to functions imported from treat', () => {
    const source = `
       import { style } from 'treats';

        const three = style({
          zIndex: 2,  
        });
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
                  "import { style } from 'treats';
                  const three = style({
                    zIndex: 2
                  });"
            `);
  });

  it('should handle renaming treat import', () => {
    const source = `
       import { style as specialStyle } from 'treat';

        const four = specialStyle({
          zIndex: 2,  
        });
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
                  "import { style as specialStyle } from 'treat';
                  const four = specialStyle({
                    zIndex: 2
                  }, \\"four\\");"
            `);
  });

  it('should handle renaming treat alias', () => {
    const source = `
       import { style } from 'my-treat-alias';

        const four = style({
          zIndex: 2,  
        });
    `;

    expect(transform(source, { alias: 'my-treat-alias' }))
      .toMatchInlineSnapshot(`
                  "import { style } from 'my-treat-alias';
                  const four = style({
                    zIndex: 2
                  }, \\"four\\");"
            `);
  });
});
