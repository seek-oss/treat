import React, { ReactNode } from 'react';
import { useStyles } from 'react-treat';
import { Box } from '../system';
import * as styleRefs from './InlineCode.treat';

export interface InlineCodeProps {
  children: ReactNode;
}
export default ({ children }: InlineCodeProps) => {
  const styles = useStyles(styleRefs);

  return (
    <Box component="code" className={styles.code}>
      {children}
    </Box>
  );
};
