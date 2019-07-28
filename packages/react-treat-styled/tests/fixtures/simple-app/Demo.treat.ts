import { styleMap } from 'treat';

interface Theme {
  rowHeight: number;
  primaryColor: string;
}

export const nonThemeStyles = styleMap({
  yellow: {
    color: 'yellow',
  },
});

export const foo = {
  someStyle: styleMap((theme: Theme) => ({
    button: {
      width: '400px',
      height: theme.rowHeight * 2,
      backgroundColor: theme.primaryColor,
    },
  })),
};
