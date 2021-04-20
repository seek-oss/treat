import intersection from 'lodash/intersection';
import once from 'lodash/once';
import Promise from 'bluebird';
import chalk from 'chalk';
import dedent from 'dedent';

import { debug } from './utils';

const trace = debug('treat:webpack-plugin:compiler');

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

export default (compat) => {
  const cache = new Map();

  const expireCache = (changedFiles) => {
    trace('Expire cache for files dependendent on: %O', changedFiles);

    Array.from(cache.entries()).forEach(
      ([identifier, { fileDependencies }]) => {
        const expiredDependencies = intersection(
          fileDependencies,
          changedFiles,
        );

        if (expiredDependencies.length > 0) {
          trace('Expire cache for %i', identifier);

          cache.delete(identifier);
        }
      },
    );
  };

  const getSource = async (loader) => {
    const identifier = loader._module.identifier();
    trace('Get compiled source: %i', identifier);

    const cachedValue = cache.get(identifier);

    if (cachedValue) {
      trace('Return cached source: %i', identifier);
      return cachedValue;
    }

    trace('No cached source. Compiling: %i', identifier);
    const compilationResult = await compileTreatSource(loader, compat);

    cache.set(identifier, compilationResult);

    return compilationResult;
  };

  const getCompiledSource = async (loader) => {
    const { source, fileDependencies, contextDependencies } = await getSource(
      loader,
    );

    // Set loader dependencies to dependecies of the child compiler
    fileDependencies.forEach((dep) => {
      loader.addDependency(dep);
    });
    contextDependencies.forEach((dep) => {
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

function compileTreatSource(loader, compat) {
  return new Promise((resolve, reject) => {
    // Child compiler will compile treat files to be evaled during compilation
    const outputOptions = { filename: loader.resourcePath };

    const childCompiler = getRootCompilation(loader).createChildCompiler(
      TWL,
      outputOptions,
    );

    const NodeTemplatePlugin = compat.getNodeTemplatePlugin(loader._compiler);
    const NodeTargetPlugin = compat.getNodeTargetPlugin(loader._compiler);
    const LimitChunkCountPlugin = compat.getLimitChunkCountPlugin(
      loader._compiler,
    );
    const ExternalsPlugin = compat.getExternalsPlugin(loader._compiler);

    new NodeTemplatePlugin(outputOptions).apply(childCompiler);
    new NodeTargetPlugin().apply(childCompiler);

    if (compat.isWebpack5) {
      const {
        EntryOptionPlugin,
        library: { EnableLibraryPlugin },
      } = loader._compiler.webpack;

      new EnableLibraryPlugin('commonjs2').apply(childCompiler);

      EntryOptionPlugin.applyEntryOption(childCompiler, loader.context, {
        child: {
          library: {
            type: 'commonjs2',
          },
          import: [loader.resourcePath],
        },
      });
    } else {
      // Webpack 4 code. Remove once support is removed
      const { LibraryTemplatePlugin, SingleEntryPlugin } = require('webpack');

      new LibraryTemplatePlugin(null, 'commonjs2').apply(childCompiler);
      new SingleEntryPlugin(loader.context, loader.resourcePath).apply(
        childCompiler,
      );
    }

    new LimitChunkCountPlugin({ maxChunks: 1 }).apply(childCompiler);
    new ExternalsPlugin('commonjs', 'treat').apply(childCompiler);

    let source;

    if (compat.isWebpack5) {
      childCompiler.hooks.compilation.tap(TWL, (compilation) => {
        compilation.hooks.processAssets.tap(TWL, () => {
          source =
            compilation.assets[loader.resourcePath] &&
            compilation.assets[loader.resourcePath].source();

          // Remove all chunk assets
          compilation.chunks.forEach((chunk) => {
            chunk.files.forEach((file) => {
              compilation.deleteAsset(file);
            });
          });
        });
      });
    } else {
      childCompiler.hooks.afterCompile.tap(TWL, (compilation) => {
        source =
          compilation.assets[loader.resourcePath] &&
          compilation.assets[loader.resourcePath].source();

        // Remove all chunk assets
        compilation.chunks.forEach((chunk) => {
          chunk.files.forEach((file) => {
            delete compilation.assets[file];
          });
        });
      });
    }

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
