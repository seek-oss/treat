import { style, styleTree } from 'treat';

const themeStyle = style(theme => ({
  lineHeight: theme.row,
}));

const regularStyle = style({
  zIndex: 3,
});

const tree = styleTree((theme, styleNode) => ({
  border: {
    small: [styleNode({ border: `${theme.row * 1}px solid pink` })],
    large: [styleNode({ border: `${theme.row * 2}px solid pink` })],
  },
}));

export default {
  themeStyle,
  regularStyle,
  tree,
};
