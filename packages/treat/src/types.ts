import { Properties } from 'csstype';
import { ThemeOrAny } from 'treat/theme';
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

type PseudoProperties = { [key in SimplePseudos[number]]?: CSSProperties };

type CSSPropertiesAndPseudos = CSSProperties & PseudoProperties;

interface SelectorMap {
  [selector: string]: CSSProperties;
}

export interface MediaQueries<StyleType> {
  '@media'?: {
    [query: string]: StyleType;
  };
}

export interface StyleWithSelectors extends CSSPropertiesAndPseudos {
  selectors?: SelectorMap;
}

export type Style = StyleWithSelectors & MediaQueries<StyleWithSelectors>;

export type GlobalStyle = CSSProperties & MediaQueries<CSSProperties>;

export type StyleMap<ClassName extends string, StyleType> = Record<
  ClassName,
  StyleType
>;

export type ThemedStyle<StyleType, Theme> =
  | ((theme: Theme) => StyleType)
  | StyleType;

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
  | undefined
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
  addTheme: (theme: TreatTheme<ThemeOrAny>) => void;
  getThemes: () => Array<TreatTheme<ThemeOrAny>>;
  getIdentName: (local: string, scopeId: number, theme?: ThemeOrAny) => string;
}
