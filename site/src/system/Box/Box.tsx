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
  alignItems?: ResponsiveProp<keyof Atoms['alignItems']>;
  justifyContent?: ResponsiveProp<keyof Atoms['justifyContent']>;
  flexGrow?: ResponsiveProp<keyof Atoms['flexGrow']>;
  flexShrink?: ResponsiveProp<keyof Atoms['flexShrink']>;
}

// @ts-ignore
function getClasses(styles: Atom, propValue?: ResponsiveProp<PropValue>) {
  if (propValue === undefined) {
    return undefined;
  }

  if (typeof propValue === 'object') {
    let classes = '';
    for (let breakpoint in propValue) {
      const atomValue = propValue[breakpoint];
      classes += `${styles[atomValue][breakpoint]} `;
    }
    return classes.slice(0, -1);
  }

  return styles[propValue].mobile;
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
  alignItems,
  justifyContent,
  flexGrow,
  flexShrink,
  ...restProps
}: BoxProps) => {
  const resetStyles = useStyles(resetStyleRefs);
  const atomStyles = useStyles(atomStyleRefs);

  const atomClasses = classnames(
    className,
    resetStyles.base,
    resetStyles.element[component as keyof typeof resetStyleRefs.element],
    getClasses(atomStyles.paddingTop, paddingTop),
    getClasses(atomStyles.paddingBottom, paddingBottom),
    getClasses(atomStyles.paddingLeft, paddingLeft),
    getClasses(atomStyles.paddingRight, paddingRight),
    getClasses(atomStyles.marginTop, marginTop),
    getClasses(atomStyles.marginBottom, marginBottom),
    getClasses(atomStyles.marginLeft, marginLeft),
    getClasses(atomStyles.marginRight, marginRight),
    getClasses(atomStyles.display, display),
    getClasses(atomStyles.alignItems, alignItems),
    getClasses(atomStyles.justifyContent, justifyContent),
    getClasses(atomStyles.flexGrow, flexGrow),
    getClasses(atomStyles.flexShrink, flexShrink),
  );

  return createElement(component, { className: atomClasses, ...restProps });
};
