import React, { Fragment } from 'react';
import { TreatProvider } from 'react-treat';

import theme from './theme.treat';
import Demo from './Demo';

export default () => (
  <Fragment>
    <TreatProvider theme={theme}>
      <Demo />
    </TreatProvider>
  </Fragment>
);
