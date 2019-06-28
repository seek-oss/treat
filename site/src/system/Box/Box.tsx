import { useStyles } from 'react-treat';
import { createElement, AllHTMLAttributes, ReactType } from 'react';
import classnames from 'classnames';
import * as resetStyleRefs from '../styles/reset.treat';
import atomStyleRefs from '../styles/atoms.treat';

type Atoms = typeof atomStyleRefs;
type Breakpoint = keyof Atoms['paddingTop'][keyof Atoms['paddingTop']];
type ResponsiveProp<AtomName> =
  | AtomName
  | { [breakpoint in Breakpoint]: AtomName };

interface BoxProps extends AllHTMLAttributes<HTMLElement> {
  component?: ReactType;
  paddingTop?: ResponsiveProp<keyof Atoms['paddingTop']>;
  paddingBottom?: ResponsiveProp<keyof Atoms['paddingBottom']>;
  paddingLeft?: ResponsiveProp<keyof Atoms['paddingLeft']>;
  paddingRight?: ResponsiveProp<keyof Atoms['paddingRight']>;
  marginTop?: ResponsiveProp<keyof Atoms['marginTop']>;
  marginBottom?: ResponsiveProp<keyof Atoms['marginBottom']>;
  marginLeft?: ResponsiveProp<keyof Atoms['marginLeft']>;
  marginRight?: ResponsiveProp<keyof Atoms['marginRight']>;
  display?: ResponsiveProp<keyof Atoms['display']>;
}

// @ts-ignore
function getClasses(styles: Atom, propValue: ResponsiveProp<PropValue>) {
  if (typeof propValue === 'string') {
    return styles[propValue].mobile;
  } else if (typeof propValue === 'object') {
    let classes = '';
    for (let breakpoint in propValue) {
      const atomValue = propValue[breakpoint];
      classes += `${styles[atomValue][breakpoint]} `;
    }
    return classes.slice(0, -1);
  }
}

export const Box = ({
  component = 'div',
  className,
  paddingTop,
  paddingBottom,
  paddingLeft,
  paddingRight,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
  display,
  ...restProps
}: BoxProps) => {
  const resetStyles = useStyles(resetStyleRefs);
  const atomStyles = useStyles(atomStyleRefs);

  const atomClasses = classnames(
    className,
    resetStyles.base,
    resetStyles.element[component as keyof typeof resetStyleRefs.element],
    paddingTop && getClasses(atomStyles.paddingTop, paddingTop),
    paddingBottom && getClasses(atomStyles.paddingBottom, paddingBottom),
    paddingLeft && getClasses(atomStyles.paddingLeft, paddingLeft),
    paddingRight && getClasses(atomStyles.paddingRight, paddingRight),
    marginTop && getClasses(atomStyles.marginTop, marginTop),
    marginBottom && getClasses(atomStyles.marginBottom, marginBottom),
    marginLeft && getClasses(atomStyles.marginLeft, marginLeft),
    marginRight && getClasses(atomStyles.marginRight, marginRight),
    display && getClasses(atomStyles.display, display),
  );

  return createElement(component, { className: atomClasses, ...restProps });
};
