import chalk from 'chalk';
import { THEMED, debugIdent } from './utils';

const formatReindex = (currIndex, newIndex) =>
  currIndex > newIndex
    ? `${chalk.green(currIndex)} -> ${chalk.red(newIndex)}`
    : `${chalk.red(currIndex)} -> ${chalk.green(newIndex)}`;

const handleInvalidIndex = (module, ownerIndex, descriptor) => {
  if (typeof ownerIndex !== 'number') {
    throw new Error(
      `Could not get ${descriptor} index for module ${module.identifier}`,
    );
  }
};

const sortModules = (modules, { getIndex, getOwnerIndex, getThemeIndex }) => {
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

      handleInvalidIndex(a, themeIndexA, 'theme');
      handleInvalidIndex(b, themeIndexB, 'theme');

      if (themeIndexA !== themeIndexB) {
        return themeIndexA - themeIndexB;
      }
    }

    const ownerIndexA = getOwnerIndex(a);
    const ownerIndexB = getOwnerIndex(b);

    handleInvalidIndex(a, ownerIndexA, 'owner');
    handleInvalidIndex(b, ownerIndexB, 'owner');

    if (ownerIndexA === ownerIndexB) {
      return getIndex(a) - getIndex(b);
    }

    return ownerIndexA - ownerIndexB;
  });
};

export default (
  modules,
  { getIndex, getIndex2, getOwnerIndex, getThemeIndex, setIndex, setIndex2 },
  { trace, target },
) => {
  trace('Sorting', target);

  const originalOrderModules = modules
    .slice()
    .sort((a, b) => getIndex(a) - getIndex(b));

  const sortedModules = sortModules(modules.slice(), {
    getIndex,
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
        newIndex: getIndex(newModuleLocation),
        newIndex2: getIndex2(newModuleLocation),
      };
    })
    .forEach(({ moduleInfo, newIndex, newIndex2 }) => {
      trace(
        'Moving',
        formatReindex(getIndex(moduleInfo), newIndex),
        debugIdent(moduleInfo.identifier),
      );

      setIndex(moduleInfo, newIndex);
      setIndex2(moduleInfo, newIndex2);
    });
};
