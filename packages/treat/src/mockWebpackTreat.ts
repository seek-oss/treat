import { Theme } from 'treat/theme';
import { WebpackTreat, TreatTheme } from './types';

const mockThemes: Array<TreatTheme<Theme>> = [];
const mockWebpackTreat: WebpackTreat = {
  addLocalCss: () => {},
  addThemedCss: () => {},
  addTheme: theme => mockThemes.push(theme),
  getThemes: () => mockThemes,
  getIdentName: (local, _, theme) => `${theme ? '_' : ''}${local}`,
};

export default mockWebpackTreat;
