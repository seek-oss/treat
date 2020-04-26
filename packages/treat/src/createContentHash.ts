import objectHash from 'object-hash';

export const createContentHash = (content: any) => {
  return objectHash
    .sha1(content)
    .slice(0, 5)
    .replace(/(^[0-9])/, '_$1');
};