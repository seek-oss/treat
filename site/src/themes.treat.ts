import { createTheme } from 'treat';

declare module 'treat/theme' {
  interface TextDefinition {
    size: number;
    rows: number;
  }

  export interface Theme {
    rowHeight: number;
    columnWidth: number;
    fontFamily: string;
    descenderHeightScale: number;
    heading: Record<'h1' | 'h2' | 'h3', TextDefinition>;
    text: Record<'standard', TextDefinition>;
  }
}

export const mainTheme = createTheme({
  rowHeight: 6,
  columnWidth: 5,
  fontFamily:
    'Roboto, "Helvetica Neue", HelveticaNeue, Helvetica, Arial, sans- serif',
  descenderHeightScale: 0.16,
  heading: {
    h1: {
      size: 42,
      rows: 8,
    },
    h2: {
      size: 28,
      rows: 6,
    },
    h3: {
      size: 21,
      rows: 5,
    },
  },
  text: {
    standard: {
      size: 16,
      rows: 4,
    },
  },
});
