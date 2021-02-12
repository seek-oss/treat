import chalk from 'chalk';

import { THEMED, debug } from './utils';

debug.formatters.r = ([currIndex, newPreIndex]) =>
  currIndex > newPreIndex
    ? `${chalk.green(currIndex)} -> ${chalk.red(newPreIndex)}`
    : `${chalk.red(currIndex)} -> ${chalk.green(newPreIndex)}`;

const trace = debug('treat:webpack-plugin:reindex');

const sortModules = (
  modules,
  { getPreIndex, getOwnerIndex, getThemeIndex },
) => {
  return modules.sort((a, b) => {
    if (a.type !== THEMED && b.type === THEMED) {
      return -1;
    }

    if (a.type === THEMED && b.type !== THEMED) {
      return 1;
    }

    if (a.type === THEMED && b.type === THEMED) {
      const themeIndexA = getThemeIndex(a);
      const themeIndexB = getThemeIndex(b);

      if (themeIndexA !== themeIndexB) {
        return themeIndexA - themeIndexB;
      }
    }

    const ownerIndexA = getOwnerIndex(a);
    const ownerIndexB = getOwnerIndex(b);

    if (ownerIndexA === ownerIndexB) {
      return getPreIndex(a) - getPreIndex(b);
    }

    return ownerIndexA - ownerIndexB;
  });
};

export default (
  modules,
  {
    getPreIndex,
    getPostIndex,
    getOwnerIndex,
    getThemeIndex,
    setPreIndex,
    setPostIndex,
  },
  target,
) => {
  trace('Sorting %s', target);

  const modulesToSort = modules.filter((m) => {
    const hasOwnerIndex = typeof getOwnerIndex(m) === 'number';
    const shouldSort =
      hasOwnerIndex &&
      (m.type !== THEMED || typeof getThemeIndex(m) === 'number');

    if (!shouldSort) {
      trace(
        'Ignoring %i from sorting. No %s index.',
        m.identifier,
        hasOwnerIndex ? 'theme' : 'owner',
      );
    }

    return shouldSort;
  });

  const originalOrderModules = modulesToSort
    .slice()
    .sort((a, b) => getPreIndex(a) - getPreIndex(b));

  const sortedModules = sortModules(modulesToSort, {
    getPreIndex,
    getOwnerIndex,
    getThemeIndex,
  });

  originalOrderModules
    .map((module) => {
      const swapModule =
        originalOrderModules[
          sortedModules.findIndex((m) => m.identifier === module.identifier)
        ];

      return [module, swapModule];
    })
    .filter(([a, b]) => a.identifier !== b.identifier)
    .map(([moduleInfo, newModuleLocation]) => {
      return {
        moduleInfo,
        newPreIndex: getPreIndex(newModuleLocation),
        newPostIndex: getPostIndex(newModuleLocation),
      };
    })
    .forEach(({ moduleInfo, newPreIndex, newPostIndex }) => {
      trace(
        'Moving %r %i',
        [getPreIndex(moduleInfo), newPreIndex],
        moduleInfo.identifier,
      );

      setPreIndex(moduleInfo, newPreIndex);
      setPostIndex(moduleInfo, newPostIndex);
    });
};
