import { resolveClassName } from './resolveClassName';
import { ThemeRef, TreatModule } from './types';

type ResolvedStyleCache = Map<TreatModule, TreatModule>;
const cache = new Map<ThemeRef, ResolvedStyleCache>();

export const resolveStyles = <UserStyles extends TreatModule>(
  themeRef: ThemeRef,
  styles: UserStyles,
): UserStyles => {
  let themeCache = cache.get(themeRef);

  if (themeCache) {
    const cachedResolvedStyles = themeCache.get(styles) as UserStyles;

    if (cachedResolvedStyles) {
      return cachedResolvedStyles;
    }
  } else {
    themeCache = new Map() as ResolvedStyleCache;
    cache.set(themeRef, themeCache);
  }

  const resolvedStyles = walkTreatModule(themeRef, styles);
  themeCache.set(styles, resolvedStyles);

  return resolvedStyles;
};

const walkTreatModule = <UserStyles extends TreatModule>(
  themeRef: ThemeRef,
  styles: UserStyles,
): UserStyles => {
  const clone = styles.constructor();

  for (let key in styles) {
    const value = styles[key];

    if (typeof value === 'string') {
      clone[key] = resolveClassName(themeRef, value);
    } else if (typeof value === 'object') {
      clone[key] = value ? walkTreatModule(themeRef, value as any) : value;
    } else {
      clone[key] = value;
    }
  }

  return clone;
};
