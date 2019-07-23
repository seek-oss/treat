import { style, globalStyle } from 'treat';
import { Theme } from '../Theme';

export const root = style((theme: Theme) => ({
  backgroundColor: theme.background.code,
  borderRadius: 10,
  overflowX: 'auto',
}));

const tokenSelector = (tokenName: string) => `${root} .${tokenName}`;

globalStyle(tokenSelector('comment'), {
  color: '#60646f',
});

globalStyle(['keyword', 'selector'].map(tokenSelector).join(', '), {
  color: '#c1d8fd',
});

globalStyle(tokenSelector('string'), {
  color: '#cbfff1',
});

globalStyle(tokenSelector('function'), {
  color: '#f0bcff',
});

globalStyle(tokenSelector('punctuation'), {
  color: '#adadff',
});

globalStyle(tokenSelector('operator'), {
  color: '#c6afff',
});
