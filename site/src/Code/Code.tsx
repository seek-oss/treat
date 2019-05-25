import React from 'react';
import { useStyles } from 'react-treat';
import * as styleRefs from './Code.treat';

export interface CodeProps {
  dangerouslySetInnerHTML: {
    __html: string;
  };
}
export default (props: CodeProps) => {
  const styles = useStyles(styleRefs);

  return (
    <pre className={styles.root}>
      <code {...props} />
    </pre>
  );
};
