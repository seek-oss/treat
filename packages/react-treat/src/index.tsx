import React, { createContext, useContext, ReactNode } from 'react';
import {
  resolveClassName,
  resolveStyles,
  ThemeRef,
  ClassRef,
  TreatModule,
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

export const useStyles = <UserStyles extends TreatModule>(styles: UserStyles) =>
  resolveStyles(useTheme(), styles);

export const useClassName = (classRef: ClassRef) =>
  resolveClassName(useTheme(), classRef);
