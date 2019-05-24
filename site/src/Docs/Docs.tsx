import React from 'react';
import { Route } from 'react-router-dom';

import SideBar from '../SideBar/SideBar';
import docsManifest from '../../docs-manifest.json';
import * as styles from './Docs.treat';

const docs = docsManifest.map(({ fileName, route }) => {
  const {
    frontMatter,
    default: component,
  } = require(`../../../docs/${fileName}`);

  return {
    component: component as (props: any) => JSX.Element,
    title: frontMatter.title as string,
    route,
  };
});

export default () => (
  <div className={styles.root}>
    <div className={styles.content}>
      {docs.map(({ route, component }) => (
        <Route key={route} path={route} component={component} />
      ))}
      <Route path="/" exact component={docs[0].component} />
    </div>
    <SideBar items={docs} />
  </div>
);
