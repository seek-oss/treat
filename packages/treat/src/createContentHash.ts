import crypto from 'crypto';

export const createContentHash = (content: any) => {
  return crypto
    .createHash('sha1')
    .update(JSON.stringify(content))
    .digest('base64')
    .slice(0, 5)
    .replace(/^((-?[0-9])|--)/, '_$1');
};
