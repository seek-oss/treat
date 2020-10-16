import * as createContentHash from './createContentHash';
import * as webpackTreat from './webpackTreat';
import { globalStyle } from './builder';

describe('builder', () => {
  it('should create @keyframes hashKey for globalStyle', () => {
    // Arrange
    const className = '.test';
    const hashKey = 'hash_key';
    const styles = {
      '@keyframes': {
        from: {
          opacity: 0,
        },
        to: {
          opacity: 1,
        },
      },
    };
    const addLocalCssSpy = jest.spyOn(webpackTreat, 'addLocalCss');
    jest
      .spyOn(createContentHash, 'createContentHash')
      .mockImplementationOnce(() => hashKey);

    // Act
    globalStyle(className, styles);

    // Assert
    expect(addLocalCssSpy).toHaveBeenCalledTimes(2);

    expect(addLocalCssSpy).toHaveBeenNthCalledWith(1, {
      [`@keyframes ${hashKey}`]: {
        from: {
          opacity: 0,
        },
        to: {
          opacity: 1,
        },
      },
    });

    expect(addLocalCssSpy).toHaveBeenNthCalledWith(2, {
      [className]: {
        '@keyframes': hashKey,
      },
    });
  });
});
