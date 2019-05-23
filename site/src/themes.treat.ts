import { createTheme } from 'treat';

declare module 'treat/theme' {
  export interface Theme {
    test: string;
  }
}

export const mainTheme = createTheme({});
