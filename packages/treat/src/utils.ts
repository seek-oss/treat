import { ThemeRef, ClassRef } from './types';

export const themePlaceholder = '$';

export const templateThemeClassRef = (classRef: string) =>
  `${themePlaceholder}${classRef}`;

export const makeThemedClassReference = (
  themeRef: ThemeRef,
  classRef: ClassRef,
) => `${classRef}${themeRef}`;

export const convertToCssClass = (ref: string) => `.${ref}`;
