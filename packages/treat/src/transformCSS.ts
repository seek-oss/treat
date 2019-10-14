import merge from 'lodash/merge';
import mapKeys from 'lodash/mapKeys';
import each from 'lodash/each';
import pick from 'lodash/pick';
import omit from 'lodash/omit';
import isEqual from 'lodash/isEqual';
import { validateSelector } from './validateSelector';

export const simplePseudos = [
  ':-moz-any-link',
  ':-moz-full-screen',
  ':-moz-placeholder',
  ':-moz-read-only',
  ':-moz-read-write',
  ':-ms-fullscreen',
  ':-ms-input-placeholder',
  ':-webkit-any-link',
  ':-webkit-full-screen',
  '::-moz-placeholder',
  '::-moz-progress-bar',
  '::-moz-range-progress',
  '::-moz-range-thumb',
  '::-moz-range-track',
  '::-moz-selection',
  '::-ms-backdrop',
  '::-ms-browse',
  '::-ms-check',
  '::-ms-clear',
  '::-ms-fill',
  '::-ms-fill-lower',
  '::-ms-fill-upper',
  '::-ms-reveal',
  '::-ms-thumb',
  '::-ms-ticks-after',
  '::-ms-ticks-before',
  '::-ms-tooltip',
  '::-ms-track',
  '::-ms-value',
  '::-webkit-backdrop',
  '::-webkit-input-placeholder',
  '::-webkit-progress-bar',
  '::-webkit-progress-inner-value',
  '::-webkit-progress-value',
  '::-webkit-slider-runnable-track',
  '::-webkit-slider-thumb',
  '::after',
  '::backdrop',
  '::before',
  '::cue',
  '::first-letter',
  '::first-line',
  '::grammar-error',
  '::placeholder',
  '::selection',
  '::spelling-error',
  ':after',
  ':any-link',
  ':before',
  ':blank',
  ':checked',
  ':default',
  ':defined',
  ':disabled',
  ':empty',
  ':enabled',
  ':first',
  ':first-child',
  ':first-letter',
  ':first-line',
  ':first-of-type',
  ':focus',
  ':focus-visible',
  ':focus-within',
  ':fullscreen',
  ':in-range',
  ':indeterminate',
  ':invalid',
  ':last-child',
  ':last-of-type',
  ':left',
  ':only-child',
  ':only-of-type',
  ':optional',
  ':out-of-range',
  ':placeholder-shown',
  ':read-only',
  ':read-write',
  ':required',
  ':right',
  ':root',
  ':scope',
  ':target',
  ':valid',

  // LVHA order
  ':link',
  ':visited',
  ':hover',
  ':active',
] as const;

export type SimplePseudos = typeof simplePseudos;

const normalizeStyles = (className: string, styles: any) => {
  const omitThese = [...simplePseudos, '@media', 'selectors'];

  const pseudoStyles = mapKeys(
    pick(styles, simplePseudos),
    (_, pseudo) => `${className}${pseudo}`,
  );

  let selectorStyles = {};
  if (styles.selectors) {
    selectorStyles = mapKeys(styles.selectors, (_, selector) => {
      // Themed selectors can be empty if themes haven't registered yet.
      // In this case don't validate the selector
      if (selector.length > 0) {
        validateSelector(selector);
      }

      return selector.replace(RegExp('&', 'g'), className);
    });
  }

  const rawRules = omit(styles, omitThese);

  const rawStyles =
    Object.keys(rawRules).length > 0
      ? {
          [className]: rawRules,
        }
      : {};

  const allStyles = Object.assign(rawStyles, pseudoStyles, selectorStyles);

  Object.keys(allStyles).forEach(ident => {
    if (allStyles[ident]['@keyframes']) {
      const { '@keyframes': keyframeRef, animation } = allStyles[ident];

      if (keyframeRef) {
        Object.assign(allStyles[ident], {
          animation: animation
            ? animation.replace('@keyframes', keyframeRef)
            : undefined,
          animationName: animation ? undefined : keyframeRef,
          '@keyframes': undefined,
        });
      }
    }
  });

  return allStyles;
};

export default (styles: any) => {
  const stylesheet = {};
  const responsiveStylesheet = {};

  Object.entries(styles).forEach(([className, styles]: [string, any]) => {
    const defaultStyles = normalizeStyles(className, styles);
    const responsiveStyles = {};

    if (styles['@media']) {
      each(styles['@media'], (mediaStyles, query) => {
        const blockStyles = normalizeStyles(className, mediaStyles);

        if (!isEqual(defaultStyles, blockStyles)) {
          merge(responsiveStyles, {
            [`@media ${query}`]: blockStyles,
          });
        }
      });
    }

    merge(stylesheet, defaultStyles);
    merge(responsiveStylesheet, responsiveStyles);
  });

  return Object.assign(stylesheet, responsiveStylesheet);
};
