import React from 'react';
import { Route } from 'react-router-dom';
import { Box } from '../system';
import DocContent from './DocContent/DocContent';

export default () => (
  <Box>
    <Route path="/:doc" component={DocContent} />
    <Route path="/" exact component={DocContent} />
  </Box>
);
