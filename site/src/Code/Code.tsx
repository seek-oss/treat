import React from 'react';
import { useStyles } from 'react-treat';
import { Box } from '../system';
import Text from '../Typography/Text';
import * as styleRefs from './Code.treat';

export interface CodeProps {
  dangerouslySetInnerHTML: {
    __html: string;
  };
}
export default (props: CodeProps) => {
  const styles = useStyles(styleRefs);
  const padding = 'xlarge';

  return (
    <Box
      className={styles.root}
      paddingTop={padding}
      paddingBottom={padding}
      paddingLeft={padding}
      paddingRight={padding}
    >
      <Text component="pre" color="code" baseline={false}>
        <code {...props} />
      </Text>
    </Box>
  );
};
