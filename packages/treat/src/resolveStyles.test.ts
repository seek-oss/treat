import { resolveStyles } from 'treat';

const themeRef = '_theme';

describe('resolveStyles', () => {
  it('should resolve an object', () => {
    const styles = {
      foo: 'abc',
      themedFoo: '$abc',
      bar: 'def',
      themedBar: '$def',
    };
    expect(resolveStyles(themeRef, styles)).toMatchInlineSnapshot(`
                                                            Object {
                                                              "bar": "def",
                                                              "foo": "abc",
                                                              "themedBar": "def_theme",
                                                              "themedFoo": "abc_theme",
                                                            }
                                        `);
  });

  it('should resolve nested objects', () => {
    const styles = {
      foo: {
        unthemed: 'abc',
        themed: '$abc',
      },
      bar: {
        unthemed: 'def',
        themed: '$def',
      },
    };
    expect(resolveStyles(themeRef, styles)).toMatchInlineSnapshot(`
                                                Object {
                                                  "bar": Object {
                                                    "themed": "def_theme",
                                                    "unthemed": "def",
                                                  },
                                                  "foo": Object {
                                                    "themed": "abc_theme",
                                                    "unthemed": "abc",
                                                  },
                                                }
                                `);
  });

  it('should resolve an object of arrays', () => {
    const styles = {
      foo: ['abc', '$abc'],
      bar: ['def', '$def'],
    };
    expect(resolveStyles(themeRef, styles)).toMatchInlineSnapshot(`
                                    Object {
                                      "bar": Array [
                                        "def",
                                        "def_theme",
                                      ],
                                      "foo": Array [
                                        "abc",
                                        "abc_theme",
                                      ],
                                    }
                        `);
  });

  it('should resolve an array', () => {
    const styles = ['abc', '$abc', 'def', '$def'];
    expect(resolveStyles(themeRef, styles)).toMatchInlineSnapshot(`
                                                      Array [
                                                        "abc",
                                                        "abc_theme",
                                                        "def",
                                                        "def_theme",
                                                      ]
                                    `);
  });

  it('should resolve nested arrays', () => {
    const styles = [
      ['abc', '$abc'],
      ['def', '$def'],
    ];
    expect(resolveStyles(themeRef, styles)).toMatchInlineSnapshot(`
                                                Array [
                                                  Array [
                                                    "abc",
                                                    "abc_theme",
                                                  ],
                                                  Array [
                                                    "def",
                                                    "def_theme",
                                                  ],
                                                ]
                                `);
  });

  it('should resolve an array of objects', () => {
    const styles = [
      {
        unthemed: 'abc',
        themed: '$abc',
      },
      {
        unthemed: 'def',
        themed: '$def',
      },
    ];
    expect(resolveStyles(themeRef, styles)).toMatchInlineSnapshot(`
                                          Array [
                                            Object {
                                              "themed": "abc_theme",
                                              "unthemed": "abc",
                                            },
                                            Object {
                                              "themed": "def_theme",
                                              "unthemed": "def",
                                            },
                                          ]
                            `);
  });

  it('should resolve a deep mixed object', () => {
    const styles = {
      foo: {
        bar: {
          baz: [
            {
              foo: {
                bar: {
                  baz: ['abc', '$abc', 'def', '$def'],
                },
              },
            },
          ],
        },
      },
    };
    expect(resolveStyles(themeRef, styles)).toMatchInlineSnapshot(`
                              Object {
                                "foo": Object {
                                  "bar": Object {
                                    "baz": Array [
                                      Object {
                                        "foo": Object {
                                          "bar": Object {
                                            "baz": Array [
                                              "abc",
                                              "abc_theme",
                                              "def",
                                              "def_theme",
                                            ],
                                          },
                                        },
                                      },
                                    ],
                                  },
                                },
                              }
                    `);
  });

  it('should pass through numbers and booleans and null', () => {
    const styles = {
      foo: 'abc',
      themedFoo: '$abc',
      number: 42,
      boolean: true,
      null: null,
    };
    expect(resolveStyles(themeRef, styles)).toMatchInlineSnapshot(`
            Object {
              "boolean": true,
              "foo": "abc",
              "null": null,
              "number": 42,
              "themedFoo": "abc_theme",
            }
        `);
  });

  it('should have a working cache', () => {
    const themeA = '_themeA';
    const themeB = '_themeB';

    const fooStyles = {
      foo: 'abc',
      themedFoo: '$abc',
    };
    const barStyles = {
      bar: 'def',
      themedBar: '$def',
    };

    const resolvedFooA = resolveStyles(themeA, fooStyles);
    const resolvedFooB = resolveStyles(themeB, fooStyles);
    const resolvedBarA = resolveStyles(themeA, barStyles);
    const resolvedBarB = resolveStyles(themeB, barStyles);

    expect(resolveStyles(themeA, fooStyles)).toBe(resolvedFooA);
    expect(resolveStyles(themeB, fooStyles)).toBe(resolvedFooB);
    expect(resolveStyles(themeA, barStyles)).toBe(resolvedBarA);
    expect(resolveStyles(themeB, barStyles)).toBe(resolvedBarB);
  });
});
