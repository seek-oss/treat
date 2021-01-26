type AnyIfEmpty<T extends object> = keyof T extends never ? any : T;

export interface Theme {}
export type ThemeOrAny = AnyIfEmpty<Theme>;
