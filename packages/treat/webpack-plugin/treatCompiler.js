const intersection = require('lodash/intersection');
const loaderUtils = require('loader-utils');
const NodeTemplatePlugin = require('webpack/lib/node/NodeTemplatePlugin');
const NodeTargetPlugin = require('webpack/lib/node/NodeTargetPlugin');
const LibraryTemplatePlugin = require('webpack/lib/LibraryTemplatePlugin');
const SingleEntryPlugin = require('webpack/lib/SingleEntryPlugin');
const LimitChunkCountPlugin = require('webpack/lib/optimize/LimitChunkCountPlugin');
const ExternalsPlugin = require('webpack/lib/ExternalsPlugin');
const Promise = require('bluebird');

const { debugIdent } = require('./utils');

const TWL = 'treat-webpack-loader';

module.exports = trace => {
  const cache = new Map();

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

  const getSource = async (loader, request) => {
    const identifier = loader._module.identifier();
    const debugIdentifier = debugIdent(identifier);
    trace('Get compiled source:', debugIdentifier);

    const cachedValue = cache.get(identifier);

    if (cachedValue) {
      trace('Return cached source:', debugIdentifier);
      return cachedValue;
    }

    trace('No cached source. Compiling:', debugIdentifier);
    const compilationResult = await compileTreatSource(loader, request);

    cache.set(identifier, compilationResult);

    return compilationResult;
  };

  const getCompiledSource = async (loader, request) => {
    const { source, fileDependencies, contextDependencies } = await getSource(
      loader,
      request,
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

function compileTreatSource(loader, request) {
  return new Promise((resolve, reject) => {
    // Child compiler will compile treat files to be evaled during compilation
    const childFilename = loaderUtils.interpolateName(loader, '[name]', {});
    const outputOptions = { filename: childFilename };

    const childCompiler = getRootCompilation(loader).createChildCompiler(
      TWL,
      outputOptions,
      [
        new NodeTemplatePlugin(outputOptions),
        new LibraryTemplatePlugin(null, 'commonjs2'),
        new NodeTargetPlugin(),
        new SingleEntryPlugin(loader.context, `!!${request}`),
        new LimitChunkCountPlugin({ maxChunks: 1 }),
        new ExternalsPlugin('commonjs', 'treat'),
      ],
    );

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

      resolve({
        source,
        fileDependencies: Array.from(compilation.fileDependencies),
        contextDependencies: Array.from(compilation.contextDependencies),
      });
    });
  });
}
