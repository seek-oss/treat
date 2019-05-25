import React from 'react';

import NavLink from '../Typography/NavLink';
import docs from '../docs-store';
import * as styles from './SideBar.treat';

export default () => (
  <div className={styles.root}>
    {docs.map(({ title, route }) => (
      <NavLink key={route} to={route}>
        {title}
      </NavLink>
    ))}
  </div>
);
