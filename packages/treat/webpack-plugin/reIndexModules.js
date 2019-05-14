const { THEMED, shortIdent } = require('./utils');

const handleInvalidOwnerIndex = (module, ownerIndex) => {
  if (typeof ownerIndex !== 'number') {
    throw new Error(
      `Could not get owner index for module ${module.identifier}`,
    );
  }
};

const sortModules = (modules, { getIndex, getOwnerIndex }) => {
  return modules.sort((a, b) => {
    if (a.type !== THEMED && b.type === THEMED) {
      return -1;
    }

    if (a.type === THEMED && b.type !== THEMED) {
      return 1;
    }

    const ownerIndexA = getOwnerIndex(a);
    const ownerIndexB = getOwnerIndex(b);

    handleInvalidOwnerIndex(a, ownerIndexA);
    handleInvalidOwnerIndex(b, ownerIndexB);

    if (ownerIndexA === ownerIndexB) {
      return getIndex(a) - getIndex(b);
    }

    return ownerIndexA - ownerIndexB;
  });
};

module.exports = (
  modules,
  { getIndex, getIndex2, getOwnerIndex, setIndex, setIndex2 },
) => {
  const originalOrderModules = modules
    .slice()
    .sort((a, b) => getIndex(a) - getIndex(b));

  const sortedModules = sortModules(modules.slice(), {
    getIndex,
    getOwnerIndex,
  });

  originalOrderModules
    .map(module => {
      const swapModule =
        originalOrderModules[
          sortedModules.findIndex(m => m.identifier === module.identifier)
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
    .forEach(({ moduleInfo, newIndex, newIndex2 }, index) => {
      // console.log([
      //   index,
      //   `Moving ${shortIdent(moduleInfo.identifier)}`,
      //   `${getIndex(moduleInfo)} -> ${newIndex}`,
      // ]);

      setIndex(moduleInfo, newIndex);
      setIndex2(moduleInfo, newIndex2);
    });
};
