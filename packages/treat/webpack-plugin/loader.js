const path = require('path');
const eval = require('eval');
const loaderUtils = require('loader-utils');
const NodeTemplatePlugin = require('webpack/lib/node/NodeTemplatePlugin');
const NodeTargetPlugin = require('webpack/lib/node/NodeTargetPlugin');
const LibraryTemplatePlugin = require('webpack/lib/LibraryTemplatePlugin');
const SingleEntryPlugin = require('webpack/lib/SingleEntryPlugin');
const LimitChunkCountPlugin = require('webpack/lib/optimize/LimitChunkCountPlugin');
const normalizePath = require('normalize-path');
const Promise = require('bluebird');
const sortBy = require('lodash/sortBy');

const virtualModules = require('./virtualModules');
const processCss = require('./processCss');
const { THEMED, LOCAL } = require('./utils');
const TreatError = require('./TreatError');

const TWL = 'treat-webpack-loader';

const stringifyLoaderRequest = loaderConfig => {
  if (typeof loaderConfig === 'string') {
    return loaderConfig;
  }

  const { loader, options = {} } = loaderConfig;

  return `${loader}?${JSON.stringify(options)}`;
};

const compileTreatSource = (loader, request) =>
  new Promise((resolve, reject) => {
    // Child compiler will compile treat files to be evaled during compilation
    const childFilename = 'treat-output-filename';
    const outputOptions = { filename: childFilename };

    const childCompiler = getRootCompilation(loader).createChildCompiler(
      TWL,
      outputOptions,
    );

    new NodeTemplatePlugin(outputOptions).apply(childCompiler);
    new LibraryTemplatePlugin(null, 'commonjs2').apply(childCompiler);
    new NodeTargetPlugin().apply(childCompiler);
    new SingleEntryPlugin(loader.context, `!!${request}`).apply(childCompiler);
    new LimitChunkCountPlugin({ maxChunks: 1 }).apply(childCompiler);

    const subCache = 'subcache ' + __dirname + ' ' + request;
    childCompiler.hooks.compilation.tap(TWL, compilation => {
      if (compilation.cache) {
        if (!compilation.cache[subCache]) compilation.cache[subCache] = {};
        compilation.cache = compilation.cache[subCache];
      }
    });

    // We set loaderContext[__dirname] = false to indicate we already in
    // a child compiler so we don't spawn another child compilers from there.
    childCompiler.hooks.thisCompilation.tap(TWL, compilation => {
      compilation.hooks.normalModuleLoader.tap(TWL, loaderContext => {
        loaderContext[__dirname] = false;
      });
    });

    let source;

    childCompiler.hooks.afterCompile.tapAsync(TWL, (compilation, callback) => {
      source =
        compilation.assets[childFilename] &&
        compilation.assets[childFilename].source();

      // Remove all chunk assets
      compilation.chunks.forEach(chunk => {
        chunk.files.forEach(file => {
          delete compilation.assets[file];
        });
      });

      callback();
    });

    childCompiler.runAsChild((err, entries, compilation) => {
      if (err) return reject(err);

      if (compilation.errors.length > 0) {
        return reject(compilation.errors[0]);
      }
      if (!source) {
        return reject(new Error("Didn't get a result from child compiler"));
      }

      compilation.fileDependencies.forEach(function(dep) {
        loader.addDependency(dep);
      }, loader);
      compilation.contextDependencies.forEach(function(dep) {
        loader.addContextDependency(dep);
      }, loader);

      resolve(source);
    });
  });

module.exports = function(source) {
  this.cacheable(false);
  return source;
};

module.exports.pitch = function(request) {
  this.cacheable(false);
  const callback = this.async();

  produce(this, request)
    .then(result => callback(null, result))
    .catch(e => {
      callback(e);
    });
};

async function produce(loader, request) {
  const {
    outputCSS,
    localIdentName,
    themeIdentName,
    outputLoaders,
    minify,
    browsers,
    store,
  } = loaderUtils.getOptions(loader);
  let hasThemedCss = false;
  let localStyles = null;
  const themedStyles = {};
  const ownedThemes = [];
  const ownedCssRequests = new Set();

  const source = await compileTreatSource(loader, request);

  const relativeResourcePath = normalizePath(
    path.relative('', loader.resourcePath),
  );

  const getThemeIdent =
    typeof themeIdentName === 'function'
      ? themeIdentName
      : () => themeIdentName;

  const getIdentName = (localName, scopeId, theme) => {
    const { resourcePath } = loader;
    const extension = path.extname(resourcePath);
    const baseName = path
      .basename(resourcePath, extension)
      .replace(/\.treat$/, '');

    const identName = theme ? getThemeIdent(theme) : localIdentName;
    const normalizedIdentName = identName
      .replace(/\[local\]/gi, localName)
      .replace(/\[name\]/gi, baseName);

    return loaderUtils
      .interpolateName(loader, normalizedIdentName, {
        content: `${relativeResourcePath}${scopeId}`,
      })
      .replace(new RegExp('[^a-zA-Z0-9\\-_\u00A0-\uFFFF]', 'g'), '-')
      .replace(/^((-?[0-9])|--)/, '_$1');
  };

  const makeCssModule = async styles => {
    const css = await processCss(styles, {
      from: loader.resourcePath,
      minify,
      browsers,
    });

    if (css) {
      const virtualCssLocation = loaderUtils.interpolateName(
        loader,
        '[path][name].[hash:base64:7].css',
        {
          content: css,
        },
      );

      // Create virtual css file for style created in this module
      virtualModules.writeModule(virtualCssLocation, css);

      return {
        request: stringifyCssRequest(virtualCssLocation, outputLoaders),
        resource: virtualCssLocation,
      };
    }

    return null;
  };

  const addLocalCss = styles => {
    localStyles = Object.assign({}, localStyles, styles);
  };

  const addThemedCss = (themeRef, styles) => {
    hasThemedCss = true;

    themedStyles[themeRef] = Object.assign({}, themedStyles[themeRef], styles);
  };

  store.addModule(loader._module.identifier());

  let result;

  try {
    result = eval(
      source,
      loader.resourcePath,
      {
        console,
        __webpack__treat__: {
          addLocalCss,
          addThemedCss,
          getThemes: store.getThemes,
          addTheme: theme => {
            ownedThemes.push(theme.themeRef);

            store.addTheme(
              theme,
              loader.resourcePath,
              loader._module.identifier(),
            );
          },
          getIdentName,
        },
      },
      true,
    );
  } catch (e) {
    throw new TreatError(e);
  }

  const allStyles = [
    ...(localStyles ? [{ type: LOCAL, styles: localStyles }] : []),
    ...Object.entries(themedStyles).map(([theme, styles]) => ({
      type: THEMED,
      theme,
      styles,
    })),
  ];

  // Make css modules from module styles
  const cssRequests = await Promise.map(
    allStyles,
    async ({ theme, type, styles }) => {
      if (outputCSS) {
        const module = await makeCssModule(styles);

        if (request) {
          return {
            type,
            theme,
            ...module,
          };
        }
      }

      return null;
    },
  ).then(requests => requests.filter(Boolean));

  if (hasThemedCss) {
    // Rebuild this module when any themes change
    store.getThemeResourcePaths().forEach(loader.addDependency);
  }

  store.addCssRequests(loader._module.identifier(), cssRequests);

  if (store.getThemeCount() > 0) {
    ownedThemes.forEach(theme => {
      store
        .getAllThemedCssRequests()
        .filter(request => request.type === LOCAL || request.theme === theme)
        .forEach(request => ownedCssRequests.add(request));
    });
  } else {
    // No themes are registered so assign css to this module
    cssRequests.forEach(request => ownedCssRequests.add(request));
  }

  return serializeTreatModule(
    loader,
    Array.from(ownedCssRequests.values()),
    result,
  );
}

const stringifyCssRequest = (cssLocation, outputLoaders) => {
  const cssLoaders = [
    ...outputLoaders,
    { loader: 'css-loader', options: { modules: false, url: false } },
  ]
    .map(stringifyLoaderRequest)
    .join('!');

  return `!${cssLoaders}!${cssLocation}`;
};

const serializeTreatModule = (loader, cssRequests, exports) => {
  const cssImports =
    cssRequests.length > 0
      ? cssRequests.map(({ request }) => {
          const relativeRequest = loaderUtils.stringifyRequest(loader, request);

          return `import ${relativeRequest};`;
        })
      : [];

  // Ensure consitent import order for content hashing
  // Chunk ordering is fixed by the webpack plugin
  const sortedCssImports = sortBy(cssImports);

  const moduleExports = Object.keys(exports).map(key =>
    key === 'default'
      ? `export default ${JSON.stringify(exports[key])};`
      : `export const ${key} = ${JSON.stringify(exports[key])};`,
  );

  return [...sortedCssImports, ...moduleExports].join('\n');
};

function getRootCompilation(loader) {
  var compiler = loader._compiler;
  var compilation = loader._compilation;
  while (compiler.parentCompilation) {
    compilation = compiler.parentCompilation;
    compiler = compilation.compiler;
  }
  return compilation;
}
