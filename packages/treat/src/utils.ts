import { ThemeRef, ClassRef } from './types';

export const makeThemedClassReference = (
  themeRef: ThemeRef,
  classRef: ClassRef,
) => `${classRef}${themeRef}`;
