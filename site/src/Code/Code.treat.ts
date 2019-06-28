import { style, globalStyle } from 'treat';
import { Theme } from '../Theme';

export const root = style((theme: Theme) => ({
  backgroundColor: theme.color.neutral,
  borderRadius: 10,
}));

const tokenSelector = (tokenName: string) => `${root} .${tokenName}`;

globalStyle(tokenSelector('comment'), {
  color: '#60646f',
});

globalStyle(tokenSelector('keyword'), {
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
