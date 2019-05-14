import React, { Fragment } from 'react';
import { TreatProvider } from 'react-treat';
import { ThemeRef } from 'treat';

import Demo from './Demo/Demo';

interface Props {
  themes: Array<ThemeRef>;
}
export default ({ themes }: Props) => (
  <Fragment>
    {themes.map((theme, index) => (
      <TreatProvider key={index} theme={theme}>
        <Demo />
      </TreatProvider>
    ))}
  </Fragment>
);
