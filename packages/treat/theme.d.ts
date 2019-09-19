type AnyIfEmpty<T extends object> = keyof T extends never ? any : T;

declare module 'treat/theme' {
  export interface Theme {}
  export type ThemeOrAny = AnyIfEmpty<Theme>
}

