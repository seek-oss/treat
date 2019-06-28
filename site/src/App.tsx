import React from 'react';
import { TreatProvider } from 'react-treat';
import { MDXProvider } from '@mdx-js/tag';

import { mainTheme } from './themes.treat';
import mdxComponents from './mdx-components';
import { Section } from './system';
import Header from './Header/Header';
import DocsPage from './DocsPage/DocsPage';

export default () => (
  <TreatProvider theme={mainTheme}>
    <MDXProvider components={mdxComponents}>
      <Section>
        <Header />
        <DocsPage />
      </Section>
    </MDXProvider>
  </TreatProvider>
);
