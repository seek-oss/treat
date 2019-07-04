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
  const padding = { mobile: 'large', desktop: 'xlarge' } as const;

  return (
    <Box
      className={styles.root}
      marginBottom={{ mobile: 'small', desktop: 'xlarge' }}
    >
      <Box
        paddingTop={padding}
        paddingBottom={padding}
        paddingLeft={padding}
        paddingRight={padding}
      >
        <Text size="small" component="div" color="code" baseline={false}>
          <code {...props} />
        </Text>
      </Box>
    </Box>
  );
};
