import React, { ReactNode, ReactType } from 'react';
import { useStyles } from 'react-treat';
import classnames from 'classnames';
import { Box } from '../system';
import * as styleRefs from './typography.treat';

export interface TextProps {
  component?: ReactType;
  size?: keyof typeof styleRefs.text;
  color?: keyof typeof styleRefs.color;
  weight?: keyof typeof styleRefs.weight;
  baseline?: boolean;
  children: ReactNode;
}
export default ({
  component = 'p',
  size = 'standard',
  color = 'neutral',
  weight = 'regular',
  baseline = true,
  children,
}: TextProps) => {
  const styles = useStyles(styleRefs);

  return (
    <Box
      component={component}
      className={classnames(
        styles.font.body,
        styles.text[size].fontSize,
        styles.color[color],
        styles.weight[weight],
        {
          [styles.text.standard.transform]: baseline,
        },
      )}
    >
      {children}
    </Box>
  );
};
