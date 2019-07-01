import React from 'react';
import { Route } from 'react-router-dom';
import { Box } from '../system';
import SideBar from '../SideBar/SideBar';
import DocContent from './DocContent/DocContent';

export default () => (
  <Box display="flex">
    <Box flexGrow={1}>
      <Route path="/:doc" component={DocContent} />
      <Route path="/" exact component={DocContent} />
    </Box>
    <Box flexGrow={0} flexShrink={0} style={{ flexBasis: 200 }}>
      <SideBar />
    </Box>
  </Box>
);
