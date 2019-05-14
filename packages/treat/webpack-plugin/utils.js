const crypto = require('crypto');

const THEMED = 'THEMED';
const LOCAL = 'LOCAL';

const createContentHash = content => {
  return crypto
    .createHash('sha1')
    .update(JSON.stringify(content))
    .digest('base64')
    .slice(0, 5);
};

const shortIdent = str => str.replace(/.*\//, '');

module.exports = {
  createContentHash,
  shortIdent,
  THEMED,
  LOCAL,
};
