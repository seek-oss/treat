import React, { ReactNode, AllHTMLAttributes } from 'react';
import Text from './Typography/Text';
import { H1, H2, H3 } from './Typography/Heading';
import { Box } from './system';
import Code from './Code/Code';

type Children = {
  children: ReactNode;
};

export default {
  p: ({ children }: Children) => (
    <Box component="p" paddingBottom="xlarge">
      <Text component="span">{children}</Text>
    </Box>
  ),
  h1: H1,
  h2: H2,
  h3: H3,
  pre: (props: AllHTMLAttributes<HTMLPreElement>) => (
    <Box component="pre" paddingBottom="large" {...props} />
  ),
  code: Code,
  th: ({ children }: Children) => (
    <Text component="th" weight="strong">
      {children}
    </Text>
  ),
  td: ({ children }: Children) => <Text component="td">{children}</Text>,
};
