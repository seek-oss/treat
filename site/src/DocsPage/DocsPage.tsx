import React, { Fragment } from 'react';
import { Route } from 'react-router-dom';
import { Title } from 'react-head';
import docs from '../docs-store';
import SiblingDoc from './SiblingDoc/SiblingDoc';
import { Box } from '../system';
import logo from '../../../logo.png';
import { Divider } from '../Divider/Divider';

export default () => (
  <Fragment>
    <img src={logo} height="32" />

    <Divider />

    {docs.map(({ route, Component, title }, index) => {
      const prevDoc = docs[index - 1];
      const nextDoc = docs[index + 1];
      const pageTitle = `Treat${index ? ` – ${title} ` : ''}`;

      return (
        <Route
          key={route}
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
  </Fragment>
);
