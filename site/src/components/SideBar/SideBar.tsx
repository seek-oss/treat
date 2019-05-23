import React from 'react';
import { NavLink } from 'react-router-dom';

interface SideBarProps {
  items: Array<{
    title: string;
    route: string;
  }>;
}
export default ({ items }: SideBarProps) => (
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    {items.map(({ title, route }) => (
      <NavLink key={route} to={route}>
        {title}
      </NavLink>
    ))}
  </div>
);
