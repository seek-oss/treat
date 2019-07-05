import React, { createElement, Fragment, ReactNode } from 'react';
import { useStyles } from 'react-treat';
import { Anchor } from '../Anchor/Anchor';
import classnames from 'classnames';

import * as styleRefs from './typography.treat';

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

const getHeadingComponent = (level: keyof typeof styleRefs.heading) => {
  if (level === '1') {
    return 'h1';
  }
  if (level === '2') {
    return 'h2';
  }
  if (level === '3') {
    return 'h3';
  }

  throw new Error('No valid heading level');
};

export interface HeadingProps {
  children: ReactNode;
  id: string;
  level: keyof typeof styleRefs.heading;
}
const Heading = ({ level, children, id }: HeadingProps) => {
  const styles = useStyles(styleRefs);

  return (
    <Fragment>
      <Anchor id={id} />
      {createElement(
        getHeadingComponent(level),
        {
          className: classnames(
            styles.font.heading,
            styles.color.neutral,
            styles.heading[level].fontSize,
            styles.heading[level].transform,
          ),
        },
        children,
      )}
    </Fragment>
  );
};

export const H1 = (props: Omit<HeadingProps, 'level'>) => (
  <Heading level="1" {...props} />
);

export const H2 = (props: Omit<HeadingProps, 'level'>) => (
  <Heading level="2" {...props} />
);

export const H3 = (props: Omit<HeadingProps, 'level'>) => (
  <Heading level="3" {...props} />
);
