import chalk from 'chalk';

export const THEMED = 'THEMED';
export const LOCAL = 'LOCAL';

export const debugIdent = (str) => chalk.blue(`"${str.replace(/.*\//, '')}"`);
