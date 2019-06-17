import { createProperty, createProperties } from './createProperty';
import { createSpacing } from './createSpacing';

const tokens = {
  grid: 4,
  spacing: {
    xsmall: 1,
    small: 2,
    medium: 3,
    large: 4,
    xlarge: 5,
  },
  breakpoints: {
    mobile: 0,
    desktop: 768,
  },
};

export const spacing = createSpacing(tokens);
// export const properties = {
//   display: createProperty(tokens, 'display', [
//     'block',
//     'inlineBlock',
//     'inline',
//     'flex',
//     'grid',
//   ]),
// };

export const properties = createProperties(tokens, {
  display: ['block', 'flex'],
});

properties.