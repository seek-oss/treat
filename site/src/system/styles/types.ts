import { Style, ClassRef } from 'treat';

export type StyleFn = (styles: Style, localDebugName?: string) => ClassRef;

export interface Grid {
  grid: number;
}

export interface Spacing<Space extends string> {
  spacing: Record<Space, number>;
}

export interface Breakpoints<Breakpoint extends string> {
  breakpoints: Record<Breakpoint, number>;
}

export interface Tokens<Space extends string, Breakpoint extends string>
  extends Grid,
    Spacing<Space>,
    Breakpoints<Breakpoint> {}
