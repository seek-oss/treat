import React from 'react';
import * as styles from './Anchor.treat';

interface AnchorProps {
  id: string;
}

export const Anchor = ({ id }: AnchorProps) => (
  <a id={id} className={styles.root} />
);
