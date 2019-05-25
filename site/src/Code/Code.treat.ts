import { style, globalStyle } from 'treat';

export const root = style(theme => ({
  backgroundColor: 'darkgrey',
  borderRadius: 3,
  padding: theme.rowHeight * 2,
  color: 'white',
}));

const tokenSelector = (tokenName: string) => `${root} .${tokenName}`;

globalStyle(tokenSelector('comment'), {
  color: 'grey',
});

globalStyle(tokenSelector('keyword'), {
  color: 'yellow',
});

globalStyle(tokenSelector('string'), {
  color: 'pink',
});

globalStyle(tokenSelector('function'), {
  color: 'orange',
});

globalStyle(tokenSelector('punctuation'), {
  color: 'blue',
});

globalStyle(tokenSelector('operator'), {
  color: 'green',
});
