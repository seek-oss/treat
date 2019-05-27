import { Theme } from 'treat/theme';
import { WebpackTreat, TreatTheme } from './types';

let scopeCount = 0;

const mockThemes: Array<TreatTheme<Theme>> = [];
let webpackTreat: WebpackTreat = {
  addLocalCss: () => {},
  addThemedCss: () => {},
  addTheme: theme => mockThemes.push(theme),
  getThemes: () => mockThemes,
  getIdentName: (local, _, theme) => `${theme ? '_' : ''}${local}`,
};

export const setWebpackTreat = (newWebpackTreat: WebpackTreat) => {
  scopeCount = 0;
  webpackTreat = newWebpackTreat;
};

export const addLocalCss: WebpackTreat['addLocalCss'] = (...props) => {
  return webpackTreat.addLocalCss(...props);
};

export const addThemedCss: WebpackTreat['addThemedCss'] = (...props) => {
  return webpackTreat.addThemedCss(...props);
};
export const addTheme: WebpackTreat['addTheme'] = (...props) => {
  return webpackTreat.addTheme(...props);
};

export const getThemes: WebpackTreat['getThemes'] = (...props) => {
  return webpackTreat.getThemes(...props);
};
export const getIdentName: WebpackTreat['getIdentName'] = (...props) => {
  return webpackTreat.getIdentName(...props);
};

export const getNextScope = () => scopeCount++;
