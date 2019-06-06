import { style, styleTree } from 'treat';

const themeStyle = style(theme => ({
  lineHeight: theme.row,
}));

const regularStyle = style({
  zIndex: 3,
});

const tree = styleTree((theme, styleNode) => ({
  foo: { bar: { baz: styleNode({ height: theme.row * 10 }) } },
}));

export default {
  themeStyle,
  regularStyle,
  tree,
};
