import React from 'react';
import { TreatProvider } from 'react-treat';
import { MDXProvider } from '@mdx-js/tag';

import { mainTheme } from './themes.treat';
import mdxComponents from './mdx-components';
import { Section, Box } from './system';
import Header from './Header/Header';
import DocsPage from './DocsPage/DocsPage';

export default () => (
  <TreatProvider theme={mainTheme}>
    <MDXProvider components={mdxComponents}>
      <Section>
        <Box display={{ mobile: 'block', desktop: 'flex' }}>
          <Box flexGrow={0} flexShrink={0} paddingRight="xxlarge">
            <Header />
          </Box>
          <Box paddingTop={{ mobile: 'small', desktop: 'xxlarge' }}>
            <DocsPage />
          </Box>
        </Box>
      </Section>
    </MDXProvider>
  </TreatProvider>
);
