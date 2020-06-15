import crypto from 'crypto';

export const createContentHash = (content: any) => {
  return crypto
    .createHash('sha1')
    .update(JSON.stringify(content))
    .digest('base64')
    // identifiers cannot start with double-dashes or numbers. Also if the first
    // char is a hyphen and the 2nd isnt a letter or underscore, then replace
    .replace(/^(((?:-{2,})?[0-9])|-[^a-z_])/i, '_$1')
    .replace(/\+/g, '') // removes all +'s
    .slice(0, 5)
};
