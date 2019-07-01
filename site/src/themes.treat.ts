import { createTheme } from 'treat';
import { Theme } from './Theme';

const theme: Theme = {
  headingFont: '"DM Sans", sans-serif',
  headingDescenderHeightScale: 0.12,
  bodyFont:
    'Roboto, "Helvetica Neue", HelveticaNeue, Helvetica, Arial, sans- serif',
  bodyDescenderHeightScale: 0.16,
  rowHeight: 4,
  columnWidth: 4,
  contentWidth: 860,
  heading: {
    h1: {
      size: 52,
      rows: 15,
    },
    h2: {
      size: 38,
      rows: 12,
    },
    h3: {
      size: 30,
      rows: 10,
    },
  },
  text: {
    standard: {
      size: 20,
      rows: 9,
    },
  },
  weight: {
    regular: 400,
    strong: 700,
  },
  color: {
    neutral: '#1f1f1f',
    code: '#fff',
  },
  background: {
    screen: '#fff',
    code: '#1f1f1f',
    note: '#fafafa',
  },
  border: {
    standard: 3,
  },
};

export const mainTheme = createTheme(theme);
