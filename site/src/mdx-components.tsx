import React, { ReactNode, AllHTMLAttributes } from 'react';
import Text from './Typography/Text';
import { H1, H2, H3 } from './Typography/Heading';
import { Box } from './system';
import Code from './Code/Code';
import Link from './Typography/Link';
import Blockquote from './Blockquote/Blockquote';

type Children = {
  children: ReactNode;
};

const P = (props: Children) => (
  <Box component="p" paddingBottom="xlarge">
    <Text component="span">{props.children}</Text>
  </Box>
);

const Pre = (props: AllHTMLAttributes<HTMLPreElement>) => (
  <Box component="pre" paddingBottom="large" {...props} />
);

const Th = (props: Children) => (
  <Text component="th" weight="strong">
    {props.children}
  </Text>
);

const Td = (props: Children) => <Text component="td">{props.children}</Text>;

const A = ({ href, ...restProps }: AllHTMLAttributes<HTMLAnchorElement>) =>
  href ? <Link to={href} {...restProps} /> : <a {...restProps} />;

export default {
  p: P,
  h1: H1,
  h2: H2,
  h3: H3,
  pre: Pre,
  code: Code,
  th: Th,
  td: Td,
  a: A,
  blockquote: Blockquote,
};
