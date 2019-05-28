import { Theme } from 'treat/theme';
import mapKeys from 'lodash/mapKeys';
import flatMap from 'lodash/flatMap';
import uniq from 'lodash/uniq';

import {
  convertToCssClass,
  themePlaceholder,
  makeThemedClassReference,
} from './utils';
import { Style, ClassRef, ThemeRef, TreatTheme } from './types';

const localClassRefs: Array<ClassRef> = [];

export const isThemedSelector = (selector: string) =>
  selector.indexOf(themePlaceholder) > -1;

export const addLocalClassRef = (classRef: ClassRef) =>
  localClassRefs.push(classRef);

export const interpolateSelector = (selector: string, themeRef?: ThemeRef) => {
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
  if (isThemedSelector(selector)) {
    return uniq(
      flatMap(selector.split(','), selectorPart =>
        themes.map(({ themeRef }) =>
          interpolateSelector(selectorPart.trim(), themeRef),
        ),
      ),
    ).join(', ');
  }

  return interpolateSelector(selector);
};

interface ProcessSelectorsParams {
  style: Style;
  themes: Array<TreatTheme<Theme>>;
  themeRef?: ThemeRef;
}
export const processSelectors = ({
  style,
  themeRef,
  themes,
}: ProcessSelectorsParams) => {
  if (style.selectors) {
    style.selectors = mapKeys(style.selectors, (_valid, key) =>
      themeRef
        ? interpolateSelector(key, themeRef)
        : combinedThemeSelector(key, themes),
    );
  }

  const media = style['@media'];

  if (media) {
    Object.keys(media).forEach(mediaQuery => {
      processSelectors({
        style: media[mediaQuery],
        themeRef,
        themes,
      });
    });
  }
};
