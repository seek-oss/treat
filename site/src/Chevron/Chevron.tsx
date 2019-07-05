import React from 'react';
import classnames from 'classnames';
import * as styles from './Chevron.treat';

export interface ChevronProps {
  direction: 'up' | 'down' | 'left' | 'right';
}

export const Chevron = ({ direction = 'down' }: ChevronProps) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 1024 1024"
    className={classnames(styles.root, styles.direction[direction])}
  >
    <path d="M945 266l78 67-510 524-510-524 75-69 435 451 432-449z" />
  </svg>
);
