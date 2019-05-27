declare module 'css-selector-parser' {
  // NOTE: This is not the entire API, just the parts we use.

  interface Rule {
    classNames?: string[];
    rule?: Rule;
  }

  export class CssSelectorParser {
    registerSelectorPseudos(...args: string[]): void;
    registerNestingOperators(...args: string[]): void;
    registerAttrEqualityMods(...args: string[]): void;
    enableSubstitutes(): void;
    parse(selector: string): Rule;
  }
}
