import React, { Fragment } from 'react';
import { TreatProvider } from 'react-treat';

import { mainTheme } from './themes.treat';
import other from './other.treat';

export default () => (
  <Fragment>
    <TreatProvider theme={mainTheme}>
      <div />
    </TreatProvider>
  </Fragment>
);
