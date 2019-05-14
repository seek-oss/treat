import React, { createContext, useContext, ReactNode } from 'react';
import {
  resolveClassNames,
  ResolveClassNamesArgs,
  resolveStyles,
  StylesMap,
  ThemeRef,
} from 'treat';

const treatThemeContext = createContext<ThemeRef | null>(null);

interface TreatProviderProps {
  theme: ThemeRef;
  children: ReactNode;
}
export const TreatProvider = ({ theme, children }: TreatProviderProps) => (
  <treatThemeContext.Provider value={theme}>
    {children}
  </treatThemeContext.Provider>
);

export const useTheme = () => {
  const theme = useContext(treatThemeContext);

  if (!theme) {
    throw new Error('No treat theme provided');
  }

  return theme;
};

export const useStyles = <ClassNames extends string>(
  styles: StylesMap<ClassNames>,
) => resolveStyles(useTheme(), styles);

export const useClassNames = (...args: ResolveClassNamesArgs) =>
  resolveClassNames(useTheme(), ...args);
