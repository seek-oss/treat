import React from 'react';
import { Route } from 'react-router-dom';

import SideBar from '../SideBar/SideBar';
import DocContent from './DocContent/DocContent';
import * as styles from './DocsPage.treat';

export default () => (
  <div className={styles.root}>
    <div className={styles.content}>
      <Route path="/:doc" component={DocContent} />
      <Route path="/" exact component={DocContent} />
    </div>
    <SideBar />
  </div>
);
