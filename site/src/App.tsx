import React from 'react';
import { TreatProvider, useStyles } from 'react-treat';
import { MDXProvider } from '@mdx-js/tag';
import { mainTheme } from './themes.treat';
import mdxComponents from './mdx-components';
import { Section, Box } from './system';
import Header from './Header/Header';
import DocsPage from './DocsPage/DocsPage';
import * as stylRefs from './App.treat';

const Content = () => {
  const styles = useStyles(stylRefs);

  return (
    <div className={styles.content}>
      <Section>
        <Box paddingTop="xxxlarge">
          <DocsPage />
        </Box>
      </Section>
    </div>
  );
};

export default () => (
  <TreatProvider theme={mainTheme}>
    <MDXProvider components={mdxComponents}>
      <Header />
      <Content />
    </MDXProvider>
  </TreatProvider>
);
