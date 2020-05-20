import { globalStyleSheet } from 'treat';

describe('Global stylesheet', () => {
  it('should not accept themed styles within the themed global style sheet', () => {
    expect(() =>
      globalStyleSheet(() => ({
        div: () => {},
      })),
    ).toThrowErrorMatchingSnapshot();
  });

  it('should not accept themed styles within the plain global style sheet', () => {
    expect(() =>
      globalStyleSheet({
        div: () => {},
      }),
    ).toThrowErrorMatchingSnapshot();
  });

  it('should accept multiple unthemed styles', () => {
    expect(() =>
      globalStyleSheet({
        div: {},
        span: {},
      }),
    ).not.toThrow();
  });
});
