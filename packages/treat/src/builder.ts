import fromPairs from 'lodash/fromPairs';
import mapKeys from 'lodash/mapKeys';

import { Theme } from 'treat/theme';
import {
  WebpackTreat,
  ClassRef,
  StyleSheet,
  StylesMap,
  PostCSS,
  Styles,
  ThemedStyles,
  ThemeRef,
  CSSKeyframes,
  CSSProperties,
} from './types';
import { makeThemedClassReference } from './utils';
import { createContentHash } from './createContentHash';
import mockWebpackTreat from './mockWebpackTreat';

declare const __webpack__treat__: WebpackTreat | undefined;

let scopeCount = 0;
const localClassRefs: Array<ClassRef> = [];

const { addLocalCss, addThemedCss, addTheme, getThemes, getIdentName } =
  typeof __webpack__treat__ === 'undefined'
    ? mockWebpackTreat
    : __webpack__treat__;

const themePlaceholder = '$';

const templateThemeClassRef = (classRef: string) =>
  `${themePlaceholder}${classRef}`;

const convertToCssClass = (ref: string) => `.${ref}`;

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

const interpolateSelector = (selector: string, themeRef?: ThemeRef) => {
  let normalisedSelector = selector;

  if (localClassRefs.length > 0) {
    const localClassRefsRegex = RegExp(`(${localClassRefs.join('|')})`, 'g');

    normalisedSelector = normalisedSelector.replace(
      localClassRefsRegex,
      (_, match) => {
        return convertToCssClass(match);
      },
    );
  }

  const themeClassRefsRegex = RegExp(
    `\\${themePlaceholder}([a-zA-Z1-9_-]+)`,
    'g',
  );

  return normalisedSelector.replace(themeClassRefsRegex, (_, match) => {
    if (!themeRef) {
      throw new Error(`No theme ref provided to 'interpolateSelector'`);
    }

    return convertToCssClass(makeThemedClassReference(themeRef, match));
  });
};

const combinedThemeSelector = (selector: string) => {
  if (selector.indexOf(themePlaceholder) > -1) {
    return getThemes()
      .map(({ themeRef }) => interpolateSelector(selector, themeRef))
      .join(', ');
  }

  return interpolateSelector(selector);
};

const processSelectors = (styles: Styles, themeRef?: ThemeRef) => {
  if (styles.selectors) {
    styles.selectors = mapKeys(styles.selectors, (_valid, key) =>
      themeRef
        ? interpolateSelector(key, themeRef)
        : combinedThemeSelector(key),
    );
  }

  const media = styles['@media'];

  if (media) {
    Object.keys(media).forEach(mediaQuery => {
      processSelectors(media[mediaQuery], themeRef);
    });
  }
};

const processAnimations = (styles: Styles, themeRef?: ThemeRef) => {
  // handle root level keyframes
  if (styles['@keyframes']) {
    styles['@keyframes'] = createKeyframe(styles['@keyframes'], themeRef);
  }

  const media = styles['@media'];

  // handle keyframes in media queries
  if (media) {
    Object.keys(media).forEach(mediaQuery => {
      processAnimations(media[mediaQuery]);
    });
  }

  // handle keyframes in simple pseudos
  Object.entries(styles)
    .filter(([property]) => property.startsWith(':'))
    .forEach(([_pseudoProperty, pseudoStyles]: [string, CSSProperties]) => {
      if (pseudoStyles['@keyframes']) {
        pseudoStyles['@keyframes'] = createKeyframe(
          pseudoStyles['@keyframes'],
          themeRef,
        );
      }
    });

  // handle keyframes in complex selectors
  if (styles.selectors) {
    Object.values(styles.selectors).forEach(style => {
      if (style['@keyframes']) {
        style['@keyframes'] = createKeyframe(style['@keyframes'], themeRef);
      }
    });
  }
};

const processStyle = (styles: Styles, themeRef?: ThemeRef) => {
  processSelectors(styles, themeRef);
  processAnimations(styles, themeRef);
};

type ThemeStyleMap = {
  [themeRef: string]: Styles;
};
const createThemedCss = (classRef: ClassRef, styles: ThemeStyleMap) => {
  Object.entries(styles).forEach(([themeRef, style]) => {
    processStyle(style, themeRef);

    const themedClassRef = makeThemedClassReference(themeRef, classRef);

    addThemedCss(themeRef, {
      [convertToCssClass(themedClassRef)]: style,
    });
  });

  return templateThemeClassRef(classRef);
};

type StyleDeclaration = Styles | ThemedStyles<Theme>;
export function style(
  styles: StyleDeclaration,
  localDebugName?: string,
): ClassRef {
  const localName = localDebugName || 'style';
  const classRef = getIdentName(localName, scopeCount++);

  if (typeof styles === 'object') {
    localClassRefs.push(classRef);

    processStyle(styles);

    addLocalCss({ [convertToCssClass(classRef)]: styles });

    return classRef;
  } else {
    const themedStyles = Object.assign(
      {},
      ...getThemes().map(({ themeRef, tokens }) => ({
        [themeRef]: styles(tokens),
      })),
    );

    return createThemedCss(classRef, themedStyles);
  }
}

export function styleMap<ClassName extends string>(
  stylesheet: StyleSheet<Theme, ClassName>,
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
      const classRef = getIdentName(createLocalName(classIdent), scopeCount++);

      classRefs[classIdent] = createThemedCss(classRef, styles);
    });
  } else {
    const postCss: PostCSS = fromPairs(
      Object.entries(stylesheet).map(
        ([classIdentifier, styles]: [ClassRef, Styles]) => {
          const classRef = getIdentName(
            createLocalName(classIdentifier),
            scopeCount++,
          );
          classRefs[classIdentifier] = classRef;
          localClassRefs.push(classRef);

          processStyle(styles);

          return [convertToCssClass(classRef), styles];
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
    themeRef: getIdentName(localDebugName || 'theme', scopeCount++, tokens),
    tokens,
  };

  addTheme(theme);

  return theme.themeRef;
}

export function globalStyle(selector: string, styles: Styles): void {
  const normalisedSelector = combinedThemeSelector(selector);

  addLocalCss({ [normalisedSelector]: styles });
}
