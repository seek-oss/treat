import { createProperty } from './createProperty';
import { createSpacing } from './createSpacing';

const tokens = {
  grid: 4,
  spacing: {
    xsmall: 1,
    small: 2,
    medium: 3,
    large: 5,
    xlarge: 8,
  },
  breakpoints: {
    mobile: 0,
    desktop: 768,
  },
};

export default {
  ...createSpacing(tokens),
  display: createProperty(tokens, 'display', [
    'block',
    'inline',
    'inlineBlock',
    'flex',
  ]),
  flexGrow: createProperty(tokens, 'flexGrow', [0, 1]),
  flexShrink: createProperty(tokens, 'flexShrink', [0, 1]),
};
