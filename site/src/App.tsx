import React, { Fragment } from 'react';
import { TreatProvider } from 'react-treat';

import { mainTheme } from './themes.treat';
import docsManifest from '../docs-manifest.json';

const docComponents = docsManifest.map(fileName => ({
  Component: require(`../../docs/${fileName}`).default as (
    props: any,
  ) => JSX.Element,
  fileName,
}));

export default () => (
  <Fragment>
    <TreatProvider theme={mainTheme}>
      <>
        {docComponents.map(({ Component, fileName }) => (
          <Component key={fileName} />
        ))}
      </>
    </TreatProvider>
  </Fragment>
);
