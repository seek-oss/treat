import { createSpacing } from './createAtoms';

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
    desktop: 1024,
  },
};

const atoms = {
  ...createSpacing(tokens),
};

export default atoms;
