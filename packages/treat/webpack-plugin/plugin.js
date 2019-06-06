const path = require('path');
const fs = require('fs');
const Promise = require('bluebird');
const partition = require('lodash/partition');
const chalk = require('chalk');
const virtualModules = require('./virtualModules');
const store = require('./store');
const reIndexModules = require('./reIndexModules');
const TreatError = require('./TreatError');
const makeTreatCompiler = require('./treatCompiler');
const { debugIdent } = require('./utils');
const AllocationHandler = require('./AllocationHandler');

const isProductionLikeMode = options => {
  return options.mode === 'production' || !options.mode;
};

const TWP = 'treat-webpack-plugin';

const makeOptionDefaulter = prodLike => (option, { dev, prod }) => {
  if (typeof option !== 'undefined') {
    return option;
  }

  return prodLike ? prod : dev;
};

const trace = (...params) => {
  console.log(chalk.green('TreatWebpackPlugin:'), ...params);
};

module.exports = class TreatWebpackPlugin {
  constructor(options = {}) {
    const {
      test = /\.treat.(js|ts)$/,
      outputCSS = true,
      outputLoaders = ['style-loader'],
      localIdentName,
      themeIdentName,
      minify,
      browsers,
      verbose = false,
      manifestFile = './treat-manifest.json',
    } = options;

    this.trace = verbose ? trace : () => {};
    this.store = store();

    this.allocationHandler = new AllocationHandler({ manifestFile });
    this.treatCompiler = makeTreatCompiler(this.trace);

    this.test = test;
    this.minify = minify;
    this.localIdentName = localIdentName;
    this.themeIdentName = themeIdentName;
    this.manifestFile = manifestFile;
    this.loaderOptions = {
      outputCSS,
      outputLoaders,
      browsers,
    };
  }

  apply(compiler) {
    if (this.loaderOptions.outputCSS) {
      virtualModules.apply(compiler);
    }

    compiler.hooks.beforeRun.tapPromise(TWP, async () => {
      this.allocationHandler.enableNewAllocations();
      await this.allocationHandler.hydrateAllocations();
    });

    compiler.hooks.done.tapPromise(TWP, async () => {
      await this.allocationHandler.persistAllocations();
    });

    compiler.hooks.watchRun.tap(TWP, watchCompiler => {
      this.treatCompiler.expireCache(
        Object.keys(watchCompiler.watchFileSystem.watcher.mtimes),
      );
    });

    compiler.hooks.thisCompilation.tap(TWP, compilation => {
      const cssModules = new Map();

      const rebuildModule = module =>
        new Promise(resolve => {
          compilation.rebuildModule(module, () => {
            resolve();
          });
        });

      compilation.hooks.finishModules.tapPromise(TWP, async () => {
        // Filter out css modules that no longer exist (watch mode)
        this.store
          .getAllCssOwners()
          .filter(identifier => !Boolean(compilation.findModule(identifier)))
          .forEach(identifier => {
            this.store.deleteCssRequests(identifier);
          });

        // Filter out theme treat modules that no longer exist (watch mode)
        this.store
          .getThemeIdentifiers()
          .filter(identifier => !Boolean(compilation.findModule(identifier)))
          .forEach(identifier => {
            this.store.deleteModuleThemes(identifier);
          });

        const finalThemeHash = this.store.getThemesHash();
        const builtTreatModules = this.store
          .popAllModules()
          .filter(
            ({ moduleIdentifier }) =>
              !this.store.getThemeIdentifiers().includes(moduleIdentifier),
          );

        // Rebuild all non theme treat modules that built before all themes were registered
        const staleModules = builtTreatModules.filter(
          ({ themeHash }) => themeHash != finalThemeHash,
        );

        await Promise.map(staleModules, async ({ moduleIdentifier }) => {
          this.trace('Rebuiling stale module: ', debugIdent(moduleIdentifier));
          const treatModule = compilation.findModule(moduleIdentifier);

          await rebuildModule(treatModule);
        });

        // Modules should be upto date so clear rebuild queue
        this.store.popAllModules();

        if (builtTreatModules.length > 0) {
          // Rebuild all theme modules to ensure they contain upto date css
          await Promise.map(
            this.store.getThemeIdentifiers(),
            async themeModuleIdentifier => {
              this.trace(
                'Rebuiling theme module: ',
                debugIdent(themeModuleIdentifier),
              );

              const treatModule = compilation.findModule(themeModuleIdentifier);

              await rebuildModule(treatModule);
            },
          );
        }

        // Build css modules Map for sorting after chunk phase
        const cssResources = this.store
          .getAllThemedCssRequests()
          .map(({ resource }) => resource);

        for (const module of compilation._modules.values()) {
          const resourceToCheck = module.resource
            ? module.resource
            : module.issuer && module.issuer.resource;

          if (resourceToCheck && cssResources.includes(resourceToCheck)) {
            const { owner, type, theme } = this.store.getThemedCssModuleInfo(
              resourceToCheck,
            );

            cssModules.set(module.identifier(), {
              ownerIdentifier: owner,
              type,
              themeIdentifier: theme
                ? this.store.getTheme(theme).identifier
                : null,
            });
          }
        }
      });

      compilation.hooks.afterChunks.tap(TWP, chunks => {
        try {
          // afterChunks hook means module/chunk order properties have been set
          // We can now correct those values by referencing the ordering of the owner treat file
          const allCssModules = Array.from(cssModules.entries()).map(
            ([identifier, moduleInfo]) => ({
              ...moduleInfo,
              module: compilation.findModule(identifier),
              owner: compilation.findModule(moduleInfo.ownerIdentifier),
              themeModule: moduleInfo.themeIdentifier
                ? compilation.findModule(moduleInfo.themeIdentifier)
                : null,
              identifier,
            }),
          );

          // Some modules may not be used and their css can be safely be removed from the chunks
          const [usedCssModules, modulesToRemove] = partition(
            allCssModules,
            ({ owner }) =>
              typeof owner.used === 'boolean' ? owner.used : true,
          );

          if (modulesToRemove.length > 0) {
            chunks.forEach(chunk => {
              modulesToRemove.forEach(({ module, identifier }) => {
                this.store.getThemeIdentifiers().forEach(themeIdentifier => {
                  const themeModule = compilation.findModule(themeIdentifier);

                  themeModule.dependencies = themeModule.dependencies.filter(
                    dependency => {
                      if (!dependency.module) {
                        return true;
                      }

                      return dependency.module.identifier() !== identifier;
                    },
                  );
                });

                chunk.removeModule(module);
              });
            });
          }

          chunks.forEach(chunk => {
            const cssModulesInChunk = usedCssModules.filter(({ module }) =>
              chunk.containsModule(module),
            );

            for (const chunkGroup of chunk.groupsIterable) {
              // Corrects ChunkGroup._moduleIndicies
              // Used for mini-extract-css-plugin ordering
              reIndexModules(
                cssModulesInChunk,
                {
                  getIndex: ({ module }) => chunkGroup.getModuleIndex(module),
                  getIndex2: ({ module }) => chunkGroup.getModuleIndex2(module),
                  getOwnerIndex: ({ owner }) => owner.index,
                  getThemeIndex: ({ themeModule }) => themeModule.index,
                  setIndex: ({ module }, i) =>
                    chunkGroup.setModuleIndex(module, i),
                  setIndex2: ({ module }, i) =>
                    chunkGroup.setModuleIndex2(module, i),
                },
                { trace: this.trace, target: 'ChunkGroup._moduleIndicies' },
              );
            }
          });

          // Corrects Module.index/index2
          reIndexModules(
            usedCssModules,
            {
              getIndex: ({ module }) => module.index,
              getIndex2: ({ module }) => module.index2,
              getOwnerIndex: ({ owner }) => owner.index,
              getThemeIndex: ({ themeModule }) => themeModule.index,
              setIndex: ({ module }, i) => (module.index = i),
              setIndex2: ({ module }, i) => (module.index2 = i),
            },
            { trace: this.trace, target: 'Module.index/index2' },
          );

          this.store
            .getThemeIdentifiers()
            .map(themeModuleIdentifier =>
              compilation.findModule(themeModuleIdentifier),
            )
            .forEach(themeModule => {
              const { dependencies } = themeModule;

              const relevantDependencies = usedCssModules
                .map(moduleInfo => ({
                  ...moduleInfo,
                  dependency: dependencies.find(
                    d =>
                      d.module &&
                      d.module.identifier() === moduleInfo.identifier,
                  ),
                }))
                .filter(({ dependency }) => dependency);

              // Corrects Dependency.sourceOrder
              // Used for regular import chunk sorting, e.g. style-loader
              reIndexModules(
                relevantDependencies,
                {
                  getIndex: ({ dependency }) => dependency.sourceOrder,
                  getOwnerIndex: ({ owner }) => owner.index,
                  getThemeIndex: ({ themeModule }) => themeModule.index,
                  setIndex: ({ dependency }, i) => {
                    dependency.sourceOrder = i;
                  },
                  // index2 not required for dependencies
                  getIndex2: () => {},
                  setIndex2: () => {},
                },
                { trace: this.trace, target: 'Dependency.sourceOrder' },
              );
            });
        } catch (e) {
          compilation.errors.push(new TreatError(e));
        }
      });
    });

    compiler.hooks.normalModuleFactory.tap(TWP, nmf => {
      nmf.hooks.afterResolve.tap(TWP, result => {
        if (this.store.getCSSResources().has(result.resource)) {
          result.settings = Object.assign({}, result.settings, {
            sideEffects: true,
          });
        }

        return result;
      });
    });

    const optionDefaulter = makeOptionDefaulter(
      isProductionLikeMode(compiler.options),
    );

    compiler.options.module.rules.splice(0, 0, {
      test: this.test,
      sideEffects: true,
      use: [
        {
          loader: require.resolve('./loader'),
          options: {
            ...this.loaderOptions,
            minify: optionDefaulter(this.minify, {
              dev: false,
              prod: true,
            }),
            localIdentName: optionDefaulter(this.localIdentName, {
              dev: '[name]-[local]_[hash:base64:5]',
              prod: '[hash:base64:5]',
            }),
            themeIdentName: optionDefaulter(this.themeIdentName, {
              dev: '_[name]-[local]_[hash:base64:4]',
              prod: '[hash:base64:4]',
            }),
            store: this.store,
            treatCompiler: this.treatCompiler,
            allocationHandler: this.allocationHandler,
          },
        },
      ],
    });
  }
};
