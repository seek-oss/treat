import { Properties } from 'csstype';
import { Theme } from 'treat/theme';
import { SimplePseudos } from './transformCSS';

export type PostCSS = object;

export type ThemeRef = string;

type CSSProperties = Properties<string | number>;

type PseudoStyles = { [key in SimplePseudos[number]]?: CSSProperties };

type CSSPropertiesAndPseudos = Properties<string | number> & PseudoStyles;

interface SelectorMap {
  [selector: string]: CSSProperties;
}

interface MediaQueries {
  [query: string]: SimpleStyles;
}

interface SimpleStyles extends CSSPropertiesAndPseudos {
  selectors?: SelectorMap;
}

export interface Styles extends SimpleStyles {
  '@media'?: MediaQueries;
}

export type ThemedStyles<Theme> = (theme: Theme) => Styles;

export type StaticStyleSheet<ClassName extends string> = Record<
  ClassName,
  Styles
>;

export type ThemedStyleSheet<Theme, ClassName extends string> = (
  theme: Theme,
) => StaticStyleSheet<ClassName>;

export type StyleSheet<Theme, ClassName extends string> =
  | ThemedStyleSheet<Theme, ClassName>
  | StaticStyleSheet<ClassName>;

export interface TreatTheme<Tokens> {
  themeRef: ThemeRef;
  tokens: Tokens;
}

export type ClassRef = string;

export type StylesMap<ClassName extends string> = Record<ClassName, ClassRef>;

type TreatModuleValue =
  | string
  | number
  | boolean
  | null
  | TreatModuleObject
  | TreatModuleArray;

interface TreatModuleObject {
  [index: string]: TreatModuleValue;
  [index: number]: TreatModuleValue;
}
interface TreatModuleArray extends Array<TreatModuleValue> {}

export type TreatModule = TreatModuleObject | TreatModuleArray;

export interface WebpackTreat {
  addLocalCss: (css: object) => void;
  addThemedCss: (themeRef: ThemeRef, css: object) => void;
  addTheme: (theme: TreatTheme<Theme>) => void;
  getThemes: () => Array<TreatTheme<Theme>>;
  getIdentName: (local: string, scopeId: number, theme?: Theme) => string;
}
