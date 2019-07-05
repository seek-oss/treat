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
      mobile: {
        size: 36,
        rows: 12,
      },
      desktop: {
        size: 52,
        rows: 15,
      },
    },
    h2: {
      mobile: {
        size: 28,
        rows: 10,
      },
      desktop: {
        size: 38,
        rows: 12,
      },
    },
    h3: {
      mobile: {
        size: 22,
        rows: 8,
      },
      desktop: {
        size: 30,
        rows: 10,
      },
    },
  },
  text: {
    standard: {
      mobile: {
        size: 17,
        rows: 7,
      },
      desktop: {
        size: 20,
        rows: 9,
      },
    },
    small: {
      mobile: {
        size: 16,
        rows: 7,
      },
      desktop: {
        size: 18,
        rows: 8,
      },
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
    body: '#fff',
    menu: '#fafafa',
    code: '#1f1f1f',
    note: '#fafafa',
  },
  border: {
    standard: 3,
  },
};

export const mainTheme = createTheme(theme);
