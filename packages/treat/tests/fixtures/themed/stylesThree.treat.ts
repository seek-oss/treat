import { style, styleTree } from 'treat';

const themeStyle = style(theme => ({
  lineHeight: theme.row,
}));

const regularStyle = style({
  zIndex: 3,
});

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

export default {
  themeStyle,
  regularStyle,
  tree,
};
