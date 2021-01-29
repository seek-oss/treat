export { resolveStyles } from './resolveStyles';
export { resolveClassName } from './resolveClassName';

export type {
  Style,
  GlobalStyle,
  CSSProperties,
  ThemeRef,
  ClassRef,
  TreatModule,
} from './types';

import * as builder from './builder';

export const createTheme: typeof builder.createTheme =
  typeof window === 'undefined' ? builder.createTheme : (null as any);

export const style: typeof builder.style =
  typeof window === 'undefined' ? builder.style : (null as any);

export const styleMap: typeof builder.styleMap =
  typeof window === 'undefined' ? builder.styleMap : (null as any);

export const styleTree: typeof builder.styleTree =
  typeof window === 'undefined' ? builder.styleTree : (null as any);

export const globalStyle: typeof builder.globalStyle =
  typeof window === 'undefined' ? builder.globalStyle : (null as any);
