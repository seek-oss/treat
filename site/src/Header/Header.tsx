import React from 'react';
import { useStyles } from 'react-treat';
import { Box } from '../system';
import logo from '../../../logo.png';
import SideBar from '../SideBar/SideBar';
import * as styleRefs from './Header.treat';
import { Link } from 'react-router-dom';

export default () => {
  const styles = useStyles(styleRefs);

  return (
    <Box paddingTop="large" paddingBottom="large" className={styles.root}>
      <Link to="/">
        <img src={logo} height="40" />
      </Link>
      <SideBar />
    </Box>
  );
};
