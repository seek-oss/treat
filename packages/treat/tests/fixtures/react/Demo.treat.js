import { styleMap } from 'treat';

export const nonThemeStyles = styleMap({
  yellow: {
    color: 'yellow',
  },
});

const someStyle = styleMap(theme => ({
  button: {
    width: '400px',
    height: theme.rowHeight * 2,
    backgroundColor: theme.primaryColor,
  },
}));

export default {
  foo: {
    someStyle,
  },
};
