import React from 'react';
import { useStyles } from 'react-treat';
import { Box } from '../system';
import * as styleRefs from './Divider.treat';

export const Divider = () => {
  const styles = useStyles(styleRefs);

  return (
    <Box
      paddingTop="large"
      paddingBottom={{ mobile: 'xsmall', desktop: 'small' }}
    >
      <div className={styles.root}>
        <div className={styles.divider} />
      </div>
    </Box>
  );
};
