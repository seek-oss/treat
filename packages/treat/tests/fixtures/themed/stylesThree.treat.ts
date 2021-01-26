import { style, styleTree } from 'treat';

const themeStyle = style((theme) => ({
  lineHeight: theme.row,
}));

const tree = styleTree((theme, styleNode) => ({
  border: {
    small: [
      styleNode({
        borderBottomWidth: `${theme.row * 1}px`,
        borderBottomStyle: 'solid',
        borderBottomColor: 'pink',
      }),
    ],
    large: [
      styleNode({
        borderBottomWidth: `${theme.row * 2}px`,
        borderBottomStyle: 'solid',
        borderBottomColor: 'pink',
      }),
    ],
  },
}));

const secondTree = styleTree((theme, styleNode) => ({
  textColor: {
    primary: [
      styleNode({
        color: theme.primaryColor,
      }),
    ],
  },
}));

const regularStyle = style({
  zIndex: 3,
});

export default {
  themeStyle,
  regularStyle,
  tree,
  secondTree,
};
