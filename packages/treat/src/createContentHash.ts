import crypto from 'crypto';

export const sanitiseBase64Hash = (hash: string) =>
  hash.replace(/^([0-9])/, '_$1').replace(/\+/g, '_');

export const createContentHash = (content: any) =>
  sanitiseBase64Hash(
    crypto
      .createHash('sha1')
      .update(JSON.stringify(content))
      .digest('base64')
      .slice(0, 5),
  );
