import React from 'react';
import { useStyles } from 'react-treat';

import * as styleRefs from './SiblingDoc.treat';
import Link from '../../Typography/Link';
import { Chevron } from '../../Chevron/Chevron';
import { Box } from '../../system';

export interface SiblingDocProps {
  title: string;
  route: string;
  direction: 'left' | 'right';
}
export default ({ title, route, direction }: SiblingDocProps) => {
  const styles = useStyles(styleRefs);

  return (
    <Box className={styles.root} paddingTop="xxlarge" paddingBottom="xxxlarge">
      {direction === 'left' ? <Chevron direction="left" /> : null}
      <Box display="inline-block" marginLeft="small" marginRight="small">
        <Link to={route}>{title}</Link>
      </Box>
      {direction === 'right' ? <Chevron direction="right" /> : null}
    </Box>
  );
};
