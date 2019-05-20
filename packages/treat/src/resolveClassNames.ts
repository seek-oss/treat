import { ClassRef, ThemeRef } from './types';
import { resolveClassName } from './resolveClassName';

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
      classes.push(resolveClassName(themeRef, arg as string));
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
          classes.push(resolveClassName(themeRef, key));
        }
      }
    }
  }

  return classes.join(' ');
};
