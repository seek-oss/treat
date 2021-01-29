import { ThemeOrAny } from 'treat/theme';
import { Adapter, TreatTheme } from './types';

let scopeCount = 0;

const mockThemes: Array<TreatTheme<ThemeOrAny>> = [];
let adapter: Adapter = {
  addLocalCss: () => {},
  addThemedCss: () => {},
  addTheme: (theme) => mockThemes.push(theme),
  getThemes: () => mockThemes,
  getIdentName: (local, _, theme) => `${theme ? '_' : ''}${local}`,
};

export const setAdapter = (newAdapter: Adapter) => {
  scopeCount = 0;
  adapter = newAdapter;
};

export const addLocalCss: Adapter['addLocalCss'] = (...props) => {
  return adapter.addLocalCss(...props);
};

export const addThemedCss: Adapter['addThemedCss'] = (...props) => {
  return adapter.addThemedCss(...props);
};
export const addTheme: Adapter['addTheme'] = (...props) => {
  return adapter.addTheme(...props);
};

export const getThemes: Adapter['getThemes'] = (...props) => {
  return adapter.getThemes(...props);
};
export const getIdentName: Adapter['getIdentName'] = (...props) => {
  return adapter.getIdentName(...props);
};

export const getNextScope = () => scopeCount++;
