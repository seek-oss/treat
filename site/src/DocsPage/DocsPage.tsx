import React from 'react';
import { Route } from 'react-router-dom';
import { Title } from 'react-head';

import { Box } from '../system';
import docs from '../docs-store';
import SiblingDoc from './SiblingDoc/SiblingDoc';

export default () => (
  <Box>
    {docs.map(({ route, Component, title }, index) => {
      const prevDoc = docs[index - 1];
      const nextDoc = docs[index + 1];
      const pageTitle = `Treat${index ? ` – ${title} ` : ''}`;

      return (
        <Route
          path={route}
          exact
          render={() => {
            return (
              <div>
                <Title>{pageTitle}</Title>
                <Component />
                {prevDoc && (
                  <div style={{ float: 'left' }}>
                    <SiblingDoc direction="left" {...prevDoc} />
                  </div>
                )}
                {nextDoc && (
                  <div style={{ float: 'right' }}>
                    <SiblingDoc direction="right" {...nextDoc} />
                  </div>
                )}
              </div>
            );
          }}
        />
      );
    })}
  </Box>
);
