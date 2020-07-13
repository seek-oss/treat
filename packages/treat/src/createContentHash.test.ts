import { sanitiseBase64Hash } from './createContentHash';

describe('sanitiseBase64Hash', () => {
  it('should add underscore to leading numbers', () => {
    expect(sanitiseBase64Hash('37ZRm')).toBe('_37ZRm');
  });

  it('should replace all "+" characters with "_"', () => {
    expect(sanitiseBase64Hash('+2+4l')).toBe('_2_4l');
  });
});
