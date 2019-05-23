import React from 'react';
import { TreatProvider } from 'react-treat';
import { Route } from 'react-router-dom';

import { mainTheme } from './themes.treat';
import docsManifest from '../docs-manifest.json';
import Header from './components/Header/Header';
import SideBar from './components/SideBar/SideBar';
import MDXComponent from '*.md';

const docs = docsManifest.map(({ fileName, route }) => {
  const { frontMatter, default: component } = require(`../../docs/${fileName}`);

  return {
    component: component as (props: any) => JSX.Element,
    title: frontMatter.title as string,
    route,
  };
});

export default () => (
  <TreatProvider theme={mainTheme}>
    <Header />
    <div style={{ display: 'flex' }}>
      <div>
        {docs.map(({ route, component }) => (
          <Route key={route} path={route} component={component} />
        ))}
        <Route path="/" exact component={docs[0].component} />
      </div>
      <SideBar items={docs} />
    </div>
  </TreatProvider>
);
