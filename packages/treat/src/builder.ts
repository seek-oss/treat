import { fromPairs, isEqual } from 'lodash';
import dedent from 'dedent';

import { Theme } from 'treat/theme';
import {
  ClassRef,
  Style,
  GlobalStyle,
  StylesMap,
  PostCSS,
  ThemeRef,
  CSSKeyframes,
  CSSProperties,
  ThemedStyle,
  StyleMap,
  TreatModule,
} from './types';
import {
  makeThemedClassReference,
  convertToCssClass,
  templateThemeClassRef,
} from './utils';
import { createContentHash } from './createContentHash';
import {
  processSelectors,
  addLocalClassRef,
  interpolateSelector,
  isThemedSelector,
} from './processSelectors';
import { validateStyle, validateGlobalStyle } from './validator';
import {
  addLocalCss,
  addThemedCss,
  addTheme,
  getThemes,
  getIdentName,
  getNextScope,
} from './webpackTreat';

const createKeyframe = (
  keyframe: string | CSSKeyframes,
  themeRef?: ThemeRef,
) => {
  if (typeof keyframe === 'string') {
    return keyframe;
  }

  const keyframeRef = createContentHash(keyframe);

  const keyframeBlock = {
    [`@keyframes ${keyframeRef}`]: keyframe,
  };

  if (themeRef) {
    addThemedCss(themeRef, keyframeBlock);
  } else {
    addLocalCss(keyframeBlock);
  }

  return keyframeRef;
};

const processAnimations = (style: Style, themeRef?: ThemeRef) => {
  // handle root level keyframes
  if (style['@keyframes']) {
    style['@keyframes'] = createKeyframe(style['@keyframes'], themeRef);
  }

  const media = style['@media'];

  // handle keyframes in media queries
  if (media) {
    Object.keys(media).forEach(mediaQuery => {
      processAnimations(media[mediaQuery]);
    });
  }

  // handle keyframes in simple pseudos
  Object.entries(style)
    .filter(([property]) => property.startsWith(':'))
    .forEach(([_pseudoProperty, pseudoStyle]: [string, CSSProperties]) => {
      if (pseudoStyle['@keyframes']) {
        pseudoStyle['@keyframes'] = createKeyframe(
          pseudoStyle['@keyframes'],
          themeRef,
        );
      }
    });

  // handle keyframes in complex selectors
  if (style.selectors) {
    Object.values(style.selectors).forEach(selectorStyle => {
      if (selectorStyle['@keyframes']) {
        selectorStyle['@keyframes'] = createKeyframe(
          selectorStyle['@keyframes'],
          themeRef,
        );
      }
    });
  }
};

const processStyle = (style: Style, themeRef?: ThemeRef) => {
  processSelectors({ style, themeRef, themes: getThemes() });
  processAnimations(style, themeRef);
};

type ThemeStyleMap = {
  [themeRef: string]: Style;
};
const createThemedCss = (classRef: ClassRef, style: ThemeStyleMap) => {
  Object.entries(style).forEach(([themeRef, themeStyle]) => {
    validateStyle(themeStyle);

    processStyle(themeStyle, themeRef);

    const themedClassRef = makeThemedClassReference(themeRef, classRef);

    addThemedCss(themeRef, {
      [convertToCssClass(themedClassRef)]: themeStyle,
    });
  });

  return templateThemeClassRef(classRef);
};

export function style(
  style: ThemedStyle<Style, Theme>,
  localDebugName?: string,
): ClassRef {
  const localName = localDebugName || 'style';
  const classRef = getIdentName(localName, getNextScope());

  if (typeof style === 'object') {
    validateStyle(style);

    addLocalClassRef(classRef);

    processStyle(style);

    addLocalCss({ [convertToCssClass(classRef)]: style });

    return classRef;
  } else {
    const themedStyle = Object.assign(
      {},
      ...getThemes().map(({ themeRef, tokens }) => {
        const themedStyle = style(tokens);
        validateStyle(themedStyle);

        return {
          [themeRef]: themedStyle,
        };
      }),
    );

    return createThemedCss(classRef, themedStyle);
  }
}

type StyleMapParam<ClassName extends string> = ThemedStyle<
  StyleMap<ClassName, Style>,
  Theme
>;
export function styleMap<ClassName extends string>(
  stylesheet: StyleMapParam<ClassName>,
  localDebugName?: string,
): StylesMap<ClassName> {
  const classRefs: { [className: string]: ClassRef } = {};
  const createLocalName = (classIdentifier: string) => {
    if (localDebugName) {
      return `${localDebugName}_${classIdentifier}`;
    }

    return classIdentifier;
  };

  if (typeof stylesheet === 'function') {
    const styleMap = new Map<string, ThemeStyleMap>();

    getThemes().forEach(({ themeRef, tokens }) => {
      const themedStyles = stylesheet(tokens);

      Object.entries(themedStyles).forEach(([classIdent, style]) => {
        const styleMapValue = styleMap.get(classIdent) || {};

        styleMap.set(
          classIdent,
          Object.assign({}, styleMapValue, { [themeRef]: style }),
        );
      });
    });

    Array.from(styleMap.entries()).forEach(([classIdent, styles]) => {
      const classRef = getIdentName(
        createLocalName(classIdent),
        getNextScope(),
      );

      classRefs[classIdent] = createThemedCss(classRef, styles);
    });
  } else {
    const postCss: PostCSS = fromPairs(
      Object.entries(stylesheet).map(
        ([classIdentifier, style]: [ClassRef, Style]) => {
          validateStyle(style);

          const classRef = getIdentName(
            createLocalName(classIdentifier),
            getNextScope(),
          );
          classRefs[classIdentifier] = classRef;
          addLocalClassRef(classRef);

          processStyle(style);

          return [convertToCssClass(classRef), style];
        },
      ),
    );

    addLocalCss(postCss);
  }

  return classRefs;
}

export const css = styleMap; // Backwards compatibility

export function createTheme(tokens: Theme, localDebugName?: string): ThemeRef {
  const theme = {
    themeRef: getIdentName(localDebugName || 'theme', getNextScope(), tokens),
    tokens,
  };

  addTheme(theme);

  return theme.themeRef;
}

export function globalStyle(
  selector: string,
  style: ThemedStyle<GlobalStyle, Theme>,
): void {
  if (isThemedSelector(selector)) {
    getThemes().forEach(theme => {
      const themedSelector = interpolateSelector(selector, theme.themeRef);

      const themeStyle =
        typeof style === 'function' ? style(theme.tokens) : style;

      validateGlobalStyle(themeStyle);

      addThemedCss(theme.themeRef, { [themedSelector]: themeStyle });
    });
  } else {
    const normalisedSelector = interpolateSelector(selector);

    if (typeof style === 'function') {
      throw Error(
        dedent`
          Unthemeable selector: ${normalisedSelector}
          
          Global styles cannot be themed unless the selector references a themed class.
          
          For example, you could add a themed class to the start of your selector (e.g. ${'`${themedClass} h1`'}).
          
          Without a reference to a themed class, there is no way to selectively apply styles based on the current theme.
        `,
      );
    }

    validateGlobalStyle(style);

    addLocalCss({ [normalisedSelector]: style });
  }
}

type MakeStyleTree<ReturnType extends TreatModule> = (
  theme: Theme,
  styleNode: (style: Style) => ClassRef,
) => ReturnType;
export function styleTree<ReturnType extends TreatModule>(
  makeStyleTree: MakeStyleTree<ReturnType>,
): ReturnType {
  const themedClassRefs = new Map<ClassRef, ThemeStyleMap>();
  const startingScope = getNextScope();

  const themedTrees = getThemes().map(({ tokens, themeRef }) => {
    let scopeCount = startingScope;

    const makeStyle = (style: Style) => {
      const classRef = getIdentName('stylenode', scopeCount++);

      const themedClassRefValue = themedClassRefs.get(classRef) || {};

      validateStyle(style);

      themedClassRefs.set(
        classRef,
        Object.assign({}, themedClassRefValue, { [themeRef]: style }),
      );

      return templateThemeClassRef(classRef);
    };

    return makeStyleTree(tokens, makeStyle);
  });

  try {
    const themedTreesJson = JSON.parse(JSON.stringify(themedTrees));
    if (!themedTreesJson || !isEqual(themedTrees, themedTreesJson)) {
      throw new Error();
    }
  } catch (err) {
    throw new Error(
      "Return values from 'styleTree' functions must only contain objects, arrays and primitive types.",
    );
  }

  const [referenceTree, ...restTrees] = themedTrees;
  restTrees.forEach(tree => {
    if (!isEqual(tree, referenceTree)) {
      throw new Error(dedent`
        Mismatching style trees.

        All 'styleTree' functions must return the same structure for every theme.
        
        To avoid this error, ensure that object keys and array lengths do not depend on unique properties of each theme.
        
        Expected:
        
        ${JSON.stringify(referenceTree, null, 2)}

        Received:
        
        ${JSON.stringify(tree, null, 2)}
      `);
    }
  });

  Array.from(themedClassRefs.entries()).forEach(([classRef, styles]) => {
    createThemedCss(classRef, styles);
  });

  return referenceTree;
}
