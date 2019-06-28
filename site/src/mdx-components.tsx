import React, { ReactNode } from 'react';
import Text from './Typography/Text';
import { H1, H2, H3 } from './Typography/Heading';
import { Box } from './system';
import Code from './Code/Code';

export default {
  p: ({ children }: { children: ReactNode }) => (
    <Box component="p" paddingBottom="xlarge">
      <Text component="span">{children}</Text>
    </Box>
  ),
  h1: H1,
  h2: H2,
  h3: H3,
  code: Code,
  th: ({ children }: { children: ReactNode }) => (
    <Text component="th" weight="strong">
      {children}
    </Text>
  ),
  td: ({ children }: { children: ReactNode }) => (
    <Text component="td">{children}</Text>
  ),
};
