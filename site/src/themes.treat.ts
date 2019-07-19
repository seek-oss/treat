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
        size: 18,
        rows: 8,
      },
      desktop: {
        size: 20,
        rows: 9,
      },
    },
    code: {
      mobile: {
        size: 14,
        rows: 6,
      },
      desktop: {
        size: 16,
        rows: 8,
      },
    },
    small: {
      mobile: {
        size: 18,
        rows: 9,
      },
      desktop: {
        size: 16,
        rows: 8,
      },
    },
    xsmall: {
      mobile: {
        size: 15,
        rows: 7,
      },
      desktop: {
        size: 15,
        rows: 7,
      },
    },
  },
  weight: {
    regular: 400,
    strong: 700,
  },
  color: {
    strong: '#26232c',
    neutral: '#46444b',
    code: '#fff',
  },
  background: {
    body: '#fff',
    menu: 'linear-gradient(0deg, #f5efff, #dbeeff)',
    overlay: '#fff',
    divider: '#d9d9d9',
    code: '#1c1724',
    note: '#f9f8fa',
  },
  border: {
    standard: 3,
  },
};

export const mainTheme = createTheme(theme);
