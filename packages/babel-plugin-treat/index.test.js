import { transformSync } from '@babel/core';
import plugin from '.';

const transform = (source, options = {}, filename = '/mockFilename.treat.js') =>
  transformSync(source, {
    filename,
    plugins: [[plugin, options]],
    configFile: false,
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
        one: {
          two: style({
            zIndex: 2,
          })
        }
      };
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
      "import { style } from 'treat';
      const test = {
        one: {
          two: style({
            zIndex: 2
          }, \\"test_one_two\\")
        }
      };"
    `);
  });

  it('should handle style returned from an arrow function', () => {
    const source = `
      import { style } from 'treat';

      const test = () => {
        return style({
          color: 'red'
        });
      };
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
      "import { style } from 'treat';
      
      const test = () => {
        return style({
          color: 'red'
        }, \\"test\\");
      };"
    `);
  });

  it('should handle style returned from a function', () => {
    const source = `
      import { style } from 'treat';

      function test() {
        return style({
          color: 'red'
        });
      }
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
      "import { style } from 'treat';
      
      function test() {
        return style({
          color: 'red'
        }, \\"test\\");
      }"
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

  it('should handle anonymous styleMaps in objects', () => {
    const source = `
       import { styleMap } from 'treat';

       export const height = {
        ...styleMap({
          one: {
            zIndex: 2,  
          }
        })
       };
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
      "import { styleMap } from 'treat';
      export const height = { ...styleMap({
          one: {
            zIndex: 2
          }
        }, \\"height\\")
      };"
    `);
  });

  it('should handle anonymous style in arrays', () => {
    const source = `
       import { style } from 'treat';

       export const height = [
        style({
          zIndex: 2,  
        })
      ];
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
      "import { style } from 'treat';
      export const height = [style({
        zIndex: 2
      }, \\"height\\")];"
    `);
  });

  it('should handle object key with anonymous style in arrays', () => {
    const source = `
       import { style } from 'treat';

       export const height = {
        full: [style({
          zIndex: 2,  
        })]
       };
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
      "import { style } from 'treat';
      export const height = {
        full: [style({
          zIndex: 2
        }, \\"height_full\\")]
      };"
    `);
  });

  it('should handle namespace imports', () => {
    const source = `
      import * as treat from 'treat';

      const one = treat.style({
          zIndex: 2,
      });
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
      "import * as treat from 'treat';
      const one = treat.style({
        zIndex: 2
      }, \\"one\\");"
    `);
  });
});
