import { Theme } from 'treat/theme';
import mapKeys from 'lodash/mapKeys';

import {
  convertToCssClass,
  themePlaceholder,
  makeThemedClassReference,
} from './utils';
import { Styles, ClassRef, ThemeRef, TreatTheme } from './types';

const localClassRefs: Array<ClassRef> = [];

export const addLocalClassRef = (classRef: ClassRef) =>
  localClassRefs.push(classRef);

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

export const combinedThemeSelector = (
  selector: string,
  themes: Array<TreatTheme<Theme>>,
) => {
  if (selector.indexOf(themePlaceholder) > -1) {
    return themes
      .map(({ themeRef }) => interpolateSelector(selector, themeRef))
      .join(', ');
  }

  return interpolateSelector(selector);
};

interface ProcessSelectorsParams {
  styles: Styles;
  themes: Array<TreatTheme<Theme>>;
  themeRef?: ThemeRef;
}
export const processSelectors = ({
  styles,
  themeRef,
  themes,
}: ProcessSelectorsParams) => {
  if (styles.selectors) {
    styles.selectors = mapKeys(styles.selectors, (_valid, key) =>
      themeRef
        ? interpolateSelector(key, themeRef)
        : combinedThemeSelector(key, themes),
    );
  }

  const media = styles['@media'];

  if (media) {
    Object.keys(media).forEach(mediaQuery => {
      processSelectors({
        styles: media[mediaQuery],
        themeRef,
        themes,
      });
    });
  }
};
