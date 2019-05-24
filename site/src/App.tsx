import React from 'react';
import { TreatProvider } from 'react-treat';
import { MDXProvider } from '@mdx-js/tag';

import { mainTheme } from './themes.treat';
import mdxComponents from './mdx-components';
import Header from './Header/Header';
import Docs from './Docs/Docs';

export default () => (
  <TreatProvider theme={mainTheme}>
    <MDXProvider components={mdxComponents}>
      <Header />
      <Docs />
    </MDXProvider>
  </TreatProvider>
);
