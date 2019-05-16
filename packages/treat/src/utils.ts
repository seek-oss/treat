import crypto from 'crypto';
import { ThemeRef, ClassRef } from './types';

export const makeThemedClassReference = (
  themeRef: ThemeRef,
  classRef: ClassRef,
) => `${classRef}${themeRef}`;

export const createContentHash = (content: any) => {
  return crypto
    .createHash('sha1')
    .update(JSON.stringify(content))
    .digest('base64')
    .slice(0, 5);
};
