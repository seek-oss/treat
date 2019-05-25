import React from 'react';
import { useStyles } from 'react-treat';

import * as styleRefs from './SiblingDoc.treat';
import Link from '../../Typography/Link';

export interface SiblingDocProps {
  title: string;
  route: string;
}
export default ({ title, route }: SiblingDocProps) => {
  const styles = useStyles(styleRefs);

  return (
    <div className={styles.root}>
      <Link to={route}>{title}</Link>
    </div>
  );
};
