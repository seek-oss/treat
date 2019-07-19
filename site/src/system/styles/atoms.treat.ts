import { createProperty } from './createProperty';
import { createSpacing } from './createSpacing';

const tokens = {
  grid: 4,
  spacing: {
    none: 0,
    xsmall: 1,
    small: 2,
    medium: 3,
    large: 5,
    xlarge: 9,
    xxlarge: 12,
    xxxlarge: 20,
  },
  breakpoints: {
    mobile: 0,
    desktop: 1024,
  },
};

export default {
  ...createSpacing(tokens),
  display: createProperty(tokens, 'display', [
    'none',
    'block',
    'inline',
    'inline-block',
    'flex',
    'inline-flex',
  ]),
  alignItems: createProperty(tokens, 'alignItems', [
    'flex-start',
    'flexEnd',
    'center',
  ]),
  justifyContent: createProperty(tokens, 'justifyContent', [
    'flex-start',
    'flex-end',
    'center',
  ]),
  flexGrow: createProperty(tokens, 'flexGrow', [0, 1]),
  flexShrink: createProperty(tokens, 'flexShrink', [0, 1]),
};
