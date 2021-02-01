const path = require('path');

import evalCode from 'eval';
import loaderUtils from 'loader-utils';
import normalizePath from 'normalize-path';
import Promise from 'bluebird';
import sortBy from 'lodash/sortBy';
import isPlainObject from 'lodash/isPlainObject';
import dedent from 'dedent';
import { stringify } from 'javascript-stringify';

import processCss from './processCss';
import { THEMED, LOCAL } from './utils';
import TreatError from './TreatError';

const stringifyLoaderRequest = (loaderConfig) => {
  if (typeof loaderConfig === 'string') {
    return loaderConfig;
  }

  const { loader, options = {} } = loaderConfig;

  return `${loader}?${JSON.stringify(options)}`;
};

export default function (source) {
  this.cacheable(true);
  return source;
}

export const pitch = function () {
  this.cacheable(true);

  const compiler = this._compiler;

  if (compiler.name === 'treat-webpack-loader') {
    if (compiler.options.output.filename !== this.resourcePath) {
      const message = dedent`Treat file import detected within treat file.

        '${compiler.options.output.filename}'
        is attempting to import 
        '${this.resourcePath}'

        Rather than referencing existing styles, this will actually generate new treat styles, 
        potentially leading to a broken UI.
      `;

      this.emitWarning(new Error(message));
    }

    // Skip treat loader as we are already within a treat child compiler
    return;
  }

  const callback = this.async();

  produce(this)
    .then((result) => callback(null, result))
    .catch((e) => {
      callback(e);
    });
};

async function produce(loader) {
  const {
    outputCSS,
    localIdentName,
    themeIdentName,
    outputLoaders,
    minify,
    browsers,
    store,
    treatCompiler,
    hmr,
  } = loaderUtils.getOptions(loader);
  let hasThemedCss = false;
  let localStyles = null;
  const themedStyles = {};
  const ownedThemes = [];
  const ownedCssRequests = new Set();

  const { source, dependencies } = await treatCompiler.getCompiledSource(
    loader,
  );

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

  const makeCssModule = async (styles) => {
    const css = await processCss(styles, {
      from: loader.resourcePath,
      minify,
      browsers,
    });

    if (css) {
      const base64 = Buffer.from(css, 'utf-8').toString('base64');

      const unloader = stringifyLoaderRequest({
        loader: '@vocab/unloader',
        options: { source: base64 },
      });
      const cssFileName = path.normalize(
        loaderUtils.interpolateName(
          loader,
          '[path][name].[hash:base64:7].treatcss',
          {
            content: css,
          },
        ),
      );

      const resource = cssFileName;

      const request = `${resource}!=!${unloader}!${loader.resourcePath}`;

      console.log({ resource, request });

      return {
        request,
        resource,
      };
    }

    return null;
  };

  const addLocalCss = (styles) => {
    localStyles = Object.assign({}, localStyles, styles);
  };

  const addThemedCss = (themeRef, styles) => {
    hasThemedCss = true;

    themedStyles[themeRef] = Object.assign({}, themedStyles[themeRef], styles);
  };

  store.addModule(loader._module.identifier());

  let result;

  const __webpack_treat__ = {
    addLocalCss,
    addThemedCss,
    getThemes: store.getThemes,
    addTheme: (theme) => {
      ownedThemes.push(theme.themeRef);

      store.addTheme(theme, loader._module.identifier(), dependencies);
    },
    getIdentName,
  };

  const sourceWithBoundLoaderInstance = `require('treat/adapter').setAdapter(__webpack_treat__);\n${source}`;

  try {
    result = evalCode(
      sourceWithBoundLoaderInstance,
      loader.resourcePath,
      {
        console,
        __webpack_treat__,
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

        if (module) {
          return {
            type,
            theme,
            ...module,
          };
        }
      }

      return null;
    },
  ).then((requests) => requests.filter(Boolean));

  if (hasThemedCss) {
    // Rebuild this module when any themes change
    store.getThemeDependencies().forEach(loader.addDependency);
  }

  store.addCssRequests(loader._module.identifier(), cssRequests);

  if (store.getThemeCount() > 0) {
    ownedThemes.forEach((theme) => {
      store
        .getAllThemedCssRequests()
        .filter((request) => request.type === LOCAL || request.theme === theme)
        .forEach((request) => ownedCssRequests.add(request));
    });
  } else {
    // No themes are registered so assign css to this module
    cssRequests.forEach((request) => ownedCssRequests.add(request));
  }

  const r = serializeTreatModule(
    loader,
    Array.from(ownedCssRequests.values()),
    result,
    hmr,
  );

  console.log(r);

  return r;
}

const stringifyExports = (value) =>
  stringify(
    value,
    (value, indent, next) => {
      const valueType = typeof value;
      if (
        valueType === 'string' ||
        valueType === 'number' ||
        valueType === 'undefined' ||
        value === null ||
        Array.isArray(value) ||
        isPlainObject(value)
      ) {
        return next(value);
      }

      throw new Error(dedent`
        Invalid treat file exports.

        You can only export plain objects, arrays, strings, numbers and null/undefined from a treat file.
      `);
    },
    0,
    {
      references: true, // Allow circular references
      maxDepth: Infinity,
      maxValues: Infinity,
    },
  );

const serializeTreatModule = (loader, cssRequests, exports, hmr) => {
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

  const moduleExports = Object.keys(exports).map((key) =>
    key === 'default'
      ? `export default ${stringifyExports(exports[key])};`
      : `export var ${key} = ${stringifyExports(exports[key])};`,
  );

  const outputCode = [...sortedCssImports, ...moduleExports];

  if (hmr) {
    outputCode.push(`
    if (module.hot) {
      var exportHash = '${loaderUtils.interpolateName(loader, '[contenthash]', {
        content: moduleExports.join(),
      })}';
            
      if (module.hot.data && typeof module.hot.data.oldExportHash === 'string' && module.hot.data.oldExportHash !== exportHash) {
        module.hot.invalidate();
      } else {
        module.hot.dispose(function(data) {
          data.oldExportHash = exportHash;
        });
  
        module.hot.accept();
      }
    }
  `);
  }

  return outputCode.join('\n');
};
