export interface DesignTokens<
  Spacing extends string,
  Breakpoint extends string
> {
  grid: number;
  spacing: Record<Spacing, number>;
  breakpoints: Record<Breakpoint, number>;
}
