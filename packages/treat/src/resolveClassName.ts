import { ThemeRef, ClassRef } from './types';
import { makeThemedClassReference } from './utils';

export const resolveClassName = (themeRef: ThemeRef, classRef: ClassRef) =>
  classRef[0] === '$'
    ? makeThemedClassReference(themeRef, classRef.substring(1))
    : classRef;
