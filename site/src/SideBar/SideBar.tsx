import React from 'react';
import { useStyles } from 'react-treat';
import NavLink from '../Typography/NavLink';
import { Box } from '../system';
import docs from '../docs-store';
import * as styleRefs from './SideBar.treat';

export default () => {
  const styles = useStyles(styleRefs);

  return (
    <Box className={styles.root}>
      <div className={styles.links}>
        {docs.map(({ title, route }) => (
          <NavLink key={route} to={route}>
            {title}
          </NavLink>
        ))}
      </div>
    </Box>
  );
};
