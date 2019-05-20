import { styleMap } from 'treat';

export const nonThemeStyles = styleMap({
  yellow: {
    color: 'yellow',
  },
});

export const foo = {
  someStyle: styleMap(theme => ({
    button: {
      width: '400px',
      height: theme.rowHeight * 2,
      backgroundColor: theme.primaryColor,
    },
  })),
};
