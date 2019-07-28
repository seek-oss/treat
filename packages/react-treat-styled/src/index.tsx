import React from "react";
import { StyledTags } from "@emotion/styled";
import { useStyles } from "react-treat";

const get = (_: any, defaultAs: keyof JSX.IntrinsicElements, __: any) => (
  className: string | string[]
) => {
  const component = React.memo(
    React.forwardRef(({ children, ...props }, ref) => {
      if (!Array.isArray(className)) {
        className = [className];
      }
      const classNames = useStyles(className);
      return React.createElement(
        defaultAs,
        { ref, className: classNames.join(" "), ...props },
        children
      );
    })
  );
  component.displayName = `${defaultAs}💅`;
  return component;
};

// see browser support https://caniuse.com/#search=proxy
// as StyledTags<{}> is not correct here, but it is good enough for PoC
export const styled = new Proxy({}, { get }) as StyledTags<{}>;
