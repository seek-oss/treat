import React from 'react';

import NavLink from '../Typography/NavLink';
import * as styles from './SideBar.treat';

interface SideBarProps {
  items: Array<{
    title: string;
    route: string;
  }>;
}
export default ({ items }: SideBarProps) => (
  <div className={styles.root}>
    {items.map(({ title, route }) => (
      <NavLink key={route} to={route}>
        {title}
      </NavLink>
    ))}
  </div>
);
