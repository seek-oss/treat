import React from 'react';
import { ThemeProvider } from 'react-treat';

import theme from './src/theme.treat';

export const wrapRootElement = ({ element }) => (
  <ThemeProvider theme={theme}>{element}</ThemeProvider>
);
