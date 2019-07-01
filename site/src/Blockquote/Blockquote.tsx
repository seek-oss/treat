import React, { ReactNode } from 'react';
import { useStyles } from 'react-treat';
import { Box } from '../system';
import * as styleRefs from './Blockquote.treat';

export default (props: { children: ReactNode }) => {
  const styles = useStyles(styleRefs);

  return (
    <Box
      paddingLeft="large"
      paddingTop="xlarge"
      marginBottom="xlarge"
      className={styles.root}
    >
      {props.children}
    </Box>
  );
};
