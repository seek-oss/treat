import { Properties } from 'csstype';
import { Theme } from 'treat/theme';
import { SimplePseudos } from './transformCSS';

export type PostCSS = object;

export type ThemeRef = string;

type BasicCSSProperties = Properties<string | number>;

export interface CSSKeyframes {
  [time: string]: BasicCSSProperties;
}

export type CSSProperties = BasicCSSProperties & {
  '@keyframes'?: CSSKeyframes | string;
};

type PseudoStyles = { [key in SimplePseudos[number]]?: CSSProperties };

type CSSPropertiesAndPseudos = CSSProperties & PseudoStyles;

interface SelectorMap {
  [selector: string]: CSSProperties;
}

export interface MediaQueries<StyleType> {
  '@media'?: {
    [query: string]: StyleType;
  };
}

interface StylesWithSelectors extends CSSPropertiesAndPseudos {
  selectors?: SelectorMap;
}

export type Styles = StylesWithSelectors & MediaQueries<StylesWithSelectors>;

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
