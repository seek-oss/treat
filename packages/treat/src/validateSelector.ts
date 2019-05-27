import { CssSelectorParser } from 'css-selector-parser';
import dedent from 'dedent';

const parser = new CssSelectorParser();
parser.registerSelectorPseudos('has');
parser.registerNestingOperators('>', '+', '~');
parser.registerAttrEqualityMods('^', '$', '*', '~');
parser.enableSubstitutes();

export const validateSelector = (selector: string) =>
  selector.split(',').map(selectorPart => {
    if (selectorPart.indexOf('&') === -1) {
      throw new Error(
        dedent`Invalid selector: ${selector}
      
        Selectors must target the ampersand character ('&'), which refers to the generated class name, e.g. '&:nth-child(2n)'`,
      );
    }

    const ampersand = '__treat_ampersand__';

    let selectorAst;
    try {
      selectorAst = parser.parse(selectorPart.replace(/&/g, `.${ampersand}`));
    } catch (err) {
      throw new Error(`Invalid selector: ${selector}`);
    }

    let targetRule = selectorAst;
    while (targetRule.rule) {
      targetRule = targetRule.rule;
    }
    if (
      !Array.isArray(targetRule.classNames) ||
      !targetRule.classNames.find(
        (className: string) => className === ampersand,
      )
    ) {
      throw new Error(
        dedent`Invalid selector: ${selector}
      
      Style selectors must end with the '&' character (along with any modifiers), e.g. ${'`${parent} &`'} or ${'`${parent} &:hover`'}.
      
      This is to ensure that each style block only affects the styling of a single class.
      
      If your selector is targeting another class, you should move it to the style definition for that class, e.g. given we have styles for 'parent' and 'child' elements, instead of adding a selector of ${'`& ${child}`'}) to 'parent', you should add ${'`${parent} &`'} to 'child').
      
      If your selector is targeting something global, use the 'globalStyle' function instead, e.g. if you wanted to write ${'`& h1`'}, you should instead write 'globalStyle(${'`${parent} h1`'}, { ... })'`,
      );
    }
  });
