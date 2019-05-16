import { ClassRef, StylesMap, ThemeRef } from './types';
import { makeThemedClassReference } from './utils';

const getClassName = (themeRef: ThemeRef, classRef: ClassRef) =>
  classRef[0] === '$'
    ? makeThemedClassReference(themeRef, classRef.substring(1))
    : classRef;

export const resolveStyles = <ClassName extends string>(
  themeRef: ThemeRef,
  styles: StylesMap<ClassName>,
): Record<ClassName, string> => {
  const classNamePairs = [];

  for (let styleKey in styles) {
    const classRef = styles[styleKey];
    const className = getClassName(themeRef, classRef);

    classNamePairs.push({ [styleKey]: className });
  }

  return Object.assign({}, ...classNamePairs);
};

const hasOwn = {}.hasOwnProperty;

export type ResolveClassNamesArgs = Array<
  | ClassRef
  | { [classRef: string]: boolean }
  | null
  | undefined
  | Array<ClassRef | null | undefined>
>;
export const resolveClassNames = (
  themeRef: ThemeRef,
  ...args: ResolveClassNamesArgs
) => {
  const classes: Array<string> = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (!arg) continue;

    const argType = typeof arg;

    if (argType === 'string') {
      classes.push(getClassName(themeRef, arg as string));
    } else if (Array.isArray(arg)) {
      const inner = resolveClassNames(themeRef, ...arg);
      if (inner) {
        classes.push(inner);
      }
    } else if (argType === 'object') {
      for (var key in arg as object) {
        if (
          hasOwn.call(arg, key) &&
          (arg as { [classRef: string]: boolean })[key]
        ) {
          classes.push(getClassName(themeRef, key));
        }
      }
    }
  }

  return classes.join(' ');
};
