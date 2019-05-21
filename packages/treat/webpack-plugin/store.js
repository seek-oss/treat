const flatten = require('lodash/flatten');

// Import from compiled code
const { createContentHash } = require('../lib/commonjs/createContentHash');

module.exports = () => {
  const treatModules = [];
  const themes = new Map();
  const themedCSSRequests = new Map();
  const cssResources = new Set();

  const getCSSResources = () => cssResources;

  const addCssRequests = (identifier, requests) => {
    requests.forEach(({ resource }) => {
      cssResources.add(resource);
    });

    if (themes.size > 0) {
      themedCSSRequests.set(identifier, requests);
    }
  };

  const deleteCssRequests = identifier => {
    const requests = themedCSSRequests.get(identifier);
    requests.forEach(({ resource }) => {
      cssResources.delete(resource);
    });

    themedCSSRequests.delete(identifier);
  };

  const getAllCssOwners = () => Array.from(themedCSSRequests.keys());

  const getAllThemedCssRequests = () =>
    flatten(Array.from(themedCSSRequests.values()));

  const getThemedCssModuleInfo = cssResource => {
    for (const [owner, requests] of themedCSSRequests.entries()) {
      for (const request of requests) {
        if (request.resource === cssResource) {
          return {
            owner,
            type: request.type,
            theme: request.theme,
          };
        }
      }
    }

    throw new Error(`Couldn't find owner module for ${cssResource}`);
  };

  const addTheme = (theme, resourcePath, identifier) => {
    themes.set(theme.themeRef, {
      theme,
      resourcePath,
      identifier,
    });
  };

  const getTheme = themeRef => themes.get(themeRef);

  const deleteModuleThemes = moduleIdentifier => {
    Array.from(themes.entries())
      .filter(([_, { identifier }]) => identifier === moduleIdentifier)
      .forEach(([themeRef]) => themes.delete(themeRef));
  };

  const getThemesHash = () => createContentHash(Array.from(themes.entries()));

  const getThemes = () => Array.from(themes.values()).map(({ theme }) => theme);

  const getThemeCount = () => themes.size;

  const getThemeResourcePaths = () =>
    Array.from(themes.values()).map(({ resourcePath }) => resourcePath);

  const getThemeIdentifiers = () =>
    Array.from(themes.values()).map(({ identifier }) => identifier);

  const popAllModules = () => treatModules.splice(0, treatModules.length);

  const addModule = moduleIdentifier =>
    treatModules.push({ moduleIdentifier, themeHash: getThemesHash() });

  return {
    popAllModules,
    addModule,
    addTheme,
    getTheme,
    getCSSResources,
    getThemeCount,
    deleteModuleThemes,
    addCssRequests,
    deleteCssRequests,
    getAllThemedCssRequests,
    getAllCssOwners,
    getThemedCssModuleInfo,
    getThemesHash,
    getThemes,
    getThemeResourcePaths,
    getThemeIdentifiers,
  };
};
