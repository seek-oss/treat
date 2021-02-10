import createDebug from 'debug';
import chalk from 'chalk';

const formatIdent = (i) => chalk.blue(`"${i.replace(/.*\//, '')}"`);

createDebug.formatters.m = (m) =>
  formatIdent(m.matchResource || m.identifier());

createDebug.formatters.i = (i) => formatIdent(i);

export const debug = createDebug;

export const THEMED = 'THEMED';
export const LOCAL = 'LOCAL';
