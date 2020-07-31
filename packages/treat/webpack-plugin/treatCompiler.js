const intersection = require('lodash/intersection');
const once = require('lodash/once');
const NodeTemplatePlugin = require('webpack/lib/node/NodeTemplatePlugin');
const NodeTargetPlugin = require('webpack/lib/node/NodeTargetPlugin');
const LibraryTemplatePlugin = require('webpack/lib/LibraryTemplatePlugin');
const SingleEntryPlugin = require('webpack/lib/SingleEntryPlugin');
const LimitChunkCountPlugin = require('webpack/lib/optimize/LimitChunkCountPlugin');
const ExternalsPlugin = require('webpack/lib/ExternalsPlugin');
const Promise = require('bluebird');
const chalk = require('chalk');
const dedent = require('dedent');

const { debugIdent } = require('./utils');

const TWL = 'treat-webpack-loader';

const logMultiWebpackError = once(() => {
  console.log(
    chalk.red(dedent`
  TreatWebpackPlugin: Error occured during treat file compilation.
  
  This error is usually caused by having multiple versions of webpack installed. 
  Ensure you only have a single version of webpack by running: '${chalk.bold(
    'yarn why webpack',
  )}' or '${chalk.bold('npm ls webpack')}'.
  `),
  );
});

module.exports = (trace, externals) => {
  const cache = new Map();
  const pendingRequests = new Map();

  const expireCache = changedFiles => {
    trace('Expire cache for files dependendent on:', changedFiles);

    Array.from(cache.entries()).forEach(
      ([identifier, { fileDependencies }]) => {
        const expiredDependencies = intersection(
          fileDependencies,
          changedFiles,
        );

        if (expiredDependencies.length > 0) {
          trace('Expire cache for', identifier);

          cache.delete(identifier);
        }
      },
    );
  };

  const getSource = loader => {
    const identifier = loader._module.identifier();
    const debugIdentifier = debugIdent(identifier);
    trace('Get compiled source:', debugIdentifier);

    const cachedValue = cache.get(identifier);

    if (cachedValue) {
      trace('Return cached source:', debugIdentifier);
      return cachedValue;
    }

    const pendingRequest = pendingRequests.get(identifier);

    if (pendingRequest) {
      trace('Return pending request:', debugIdentifier);
      return pendingRequest;
    }

    trace('No pending request, compiling source:', debugIdentifier);
    const pendingCompile = compileTreatSource(loader, externals)
      .then(compilationResult => {
        cache.set(identifier, compilationResult);

        return compilationResult;
      })
      .finally(() => {
        pendingRequests.delete(identifier);
      });

    pendingRequests.set(identifier, pendingCompile);

    return pendingCompile;
  };

  const getCompiledSource = async loader => {
    const { source, fileDependencies, contextDependencies } = await getSource(
      loader,
    );

    // Set loader dependencies to dependecies of the child compiler
    fileDependencies.forEach(dep => {
      loader.addDependency(dep);
    });
    contextDependencies.forEach(dep => {
      loader.addContextDependency(dep);
    });

    return {
      source,
      dependencies: fileDependencies,
    };
  };

  return {
    getCompiledSource,
    expireCache,
  };
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

function compileTreatSource(loader, externals) {
  return new Promise((resolve, reject) => {
    // Child compiler will compile treat files to be evaled during compilation
    const outputOptions = { filename: loader.resourcePath };

    const plugins = [
      new NodeTemplatePlugin(outputOptions),
      new LibraryTemplatePlugin(null, 'commonjs2'),
      new NodeTargetPlugin(),
      new SingleEntryPlugin(loader.context, loader.resourcePath),
      new LimitChunkCountPlugin({ maxChunks: 1 }),
      new ExternalsPlugin('commonjs', 'treat'),
    ];

    if (externals) {
      plugins.push(new ExternalsPlugin('commonjs', externals));
    }

    const childCompiler = getRootCompilation(loader).createChildCompiler(
      TWL,
      outputOptions,
      plugins,
    );

    const subCache = 'subcache ' + __dirname + ' ' + loader.resourcePath;
    childCompiler.hooks.compilation.tap(TWL, compilation => {
      if (compilation.cache) {
        if (!compilation.cache[subCache]) compilation.cache[subCache] = {};
        compilation.cache = compilation.cache[subCache];
      }
    });

    let source;

    childCompiler.hooks.afterCompile.tapAsync(TWL, (compilation, callback) => {
      source =
        compilation.assets[loader.resourcePath] &&
        compilation.assets[loader.resourcePath].source();

      // Remove all chunk assets
      compilation.chunks.forEach(chunk => {
        chunk.files.forEach(file => {
          delete compilation.assets[file];
        });
      });

      callback();
    });

    try {
      childCompiler.runAsChild((err, entries, compilation) => {
        if (err) return reject(err);

        if (compilation.errors.length > 0) {
          return reject(compilation.errors[0]);
        }
        if (!source) {
          return reject(new Error("Didn't get a result from child compiler"));
        }

        resolve({
          source,
          fileDependencies: Array.from(compilation.fileDependencies),
          contextDependencies: Array.from(compilation.contextDependencies),
        });
      });
    } catch (e) {
      if (
        e.message.indexOf(
          'No dependency factory available for this dependency type: SingleEntryDependency',
        ) > -1
      ) {
        logMultiWebpackError();
      }

      reject(e);
    }
  });
}
