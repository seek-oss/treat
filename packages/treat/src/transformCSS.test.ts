import transformCSS from './transformCSS';

describe('transformCSS', () => {
  it('should handle media queries', () => {
    expect(
      transformCSS({
        '.testClass': {
          color: 'red',
          '@media': {
            'screen and (min-width: 700px)': {
              color: 'green',
            },
            'screen and (min-width: 1000px)': {
              color: 'purple',
            },
          },
        },
      }),
    ).toMatchInlineSnapshot(`
      Object {
        ".testClass": Object {
          "color": "red",
        },
        "@media screen and (min-width: 1000px)": Object {
          ".testClass": Object {
            "color": "purple",
          },
        },
        "@media screen and (min-width: 700px)": Object {
          ".testClass": Object {
            "color": "green",
          },
        },
      }
    `);
  });

  it('should remove irrelevant media queries', () => {
    expect(
      transformCSS({
        '.testClass': {
          color: 'red',
          '@media': {
            'screen and (min-width: 700px)': {
              color: 'red',
            },
          },
        },
      }),
    ).toMatchInlineSnapshot(`
                            Object {
                              ".testClass": Object {
                                "color": "red",
                              },
                            }
                `);
  });

  it('should combine media queries', () => {
    expect(
      transformCSS({
        '.testClass': {
          color: 'green',
          '@media': {
            'screen and (min-width: 700px)': {
              color: 'red',
            },
          },
        },
        '.otherClass': {
          color: 'purple',
          '@media': {
            'screen and (min-width: 700px)': {
              color: 'red',
            },
          },
        },
      }),
    ).toMatchInlineSnapshot(`
            Object {
              ".otherClass": Object {
                "color": "purple",
              },
              ".testClass": Object {
                "color": "green",
              },
              "@media screen and (min-width: 700px)": Object {
                ".otherClass": Object {
                  "color": "red",
                },
                ".testClass": Object {
                  "color": "red",
                },
              },
            }
        `);
  });

  it('should handle simple pseudos', () => {
    expect(
      transformCSS({
        '.testClass': {
          color: 'red',
          ':hover': {
            color: 'blue',
          },
        },
      }),
    ).toMatchInlineSnapshot(`
                          Object {
                            ".testClass": Object {
                              "color": "red",
                            },
                            ".testClass:hover": Object {
                              "color": "blue",
                            },
                          }
                `);
  });

  it('should handle complex selectors', () => {
    expect(
      transformCSS({
        '.testClass': {
          color: 'red',
          selectors: {
            '&:nth-child(3)': {
              color: 'blue',
            },
          },
        },
      }),
    ).toMatchInlineSnapshot(`
                        Object {
                          ".testClass": Object {
                            "color": "red",
                          },
                          ".testClass:nth-child(3)": Object {
                            "color": "blue",
                          },
                        }
                `);
  });
});
