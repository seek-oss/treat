import React from 'react';
import { TreatProvider } from 'react-treat';
import { MDXProvider } from '@mdx-js/tag';
import { mainTheme } from './themes.treat';
import mdxComponents from './mdx-components';
import { Section, Box } from './system';
import Header from './Header/Header';
import DocsPage from './DocsPage/DocsPage';
import './App.treat';

export default () => (
  <TreatProvider theme={mainTheme}>
    <MDXProvider components={mdxComponents}>
      <Header />
      <Section>
        <Box paddingTop="xxlarge">
          <DocsPage />
        </Box>
      </Section>
    </MDXProvider>
  </TreatProvider>
);
