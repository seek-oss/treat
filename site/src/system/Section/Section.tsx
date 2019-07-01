import React, { ReactNode } from 'react';
import { useStyles } from 'react-treat';
import { Box } from '../';
import * as styleRefs from './Section.treat';

export const Section = ({ children }: { children: ReactNode }) => {
  const styles = useStyles(styleRefs);
  const gutter = 'large';

  return (
    <Box className={styles.root} paddingLeft={gutter} paddingRight={gutter}>
      {children}
    </Box>
  );
};