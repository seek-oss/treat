const chalk = require('chalk');

const THEMED = 'THEMED';
const LOCAL = 'LOCAL';

const debugIdent = str => chalk.blue(`"${str.replace(/.*\//, '')}"`);

module.exports = {
  debugIdent,
  THEMED,
  LOCAL,
};
