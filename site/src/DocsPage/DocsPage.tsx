import React, { Fragment } from 'react';
import { Route } from 'react-router-dom';
import { Title, Meta } from 'react-head';
import docs from '../docs-store';
import SiblingDoc from './SiblingDoc/SiblingDoc';
import logo from '../../../logo.png';
import { Divider } from '../Divider/Divider';
import { useHeadingRouteUpdates } from '../useHeadingRoute';
import { Box } from '../system';

interface DocsRouteProps {
  component: (props: any) => JSX.Element;
  prevDoc?: {
    title: string;
    route: string;
  };
  nextDoc?: {
    title: string;
    route: string;
  };
  hashes: Array<string>;
}
const DocsRoute = ({
  component: Component,
  prevDoc,
  nextDoc,
  hashes,
}: DocsRouteProps) => {
  useHeadingRouteUpdates(hashes);

  return (
    <div>
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
};

export default () => (
  <Box paddingBottom="xxxlarge">
    <img src={logo} height="36" style={{ position: 'relative', left: -6 }} />

    <Box display={{ mobile: 'none', desktop: 'block' }}>
      <Divider />
    </Box>

    {docs.map(({ route, Component, title, sections }, index) => {
      const prevDoc = docs[index - 1];
      const nextDoc = docs[index + 1];
      const pageTitle = `treat${index ? ` – ${title} ` : ''}`.trim();
      const description =
        index > 0
          ? null
          : 'Themeable, typed CSS-in-JS with (basically) zero runtime. What a treat.';
      const hashes = sections.map(({ hash }) => hash);

      return (
        <Route
          key={route}
          path={route}
          exact
          render={() => (
            <Fragment>
              <Title>{pageTitle}</Title>
              {description ? (
                <Meta name="description" content={description} />
              ) : null}
              <DocsRoute
                nextDoc={nextDoc}
                prevDoc={prevDoc}
                hashes={hashes}
                component={Component}
              />
            </Fragment>
          )}
        />
      );
    })}
  </Box>
);
