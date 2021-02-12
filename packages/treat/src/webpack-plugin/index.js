import Promise from 'bluebird';
import partition from 'lodash/partition';
import chalk from 'chalk';

import store from './store';
import reIndexModules from './reIndexModules';
import TreatError from './TreatError';
import makeTreatCompiler from './treatCompiler';
import optionValidator from './optionValidator';
import { debug } from './utils';
import createCompat from './compat';

const isProductionLikeMode = (options) => {
  return options.mode === 'production' || !options.mode;
};

const trace = debug('treat:webpack-plugin');

const TWP = 'treat-webpack-plugin';

const makeOptionDefaulter = (prodLike) => (option, { dev, prod }) => {
  if (typeof option !== 'undefined') {
    return option;
  }

  return prodLike ? prod : dev;
};

export class TreatPlugin {
  constructor(options = {}) {
    optionValidator(options);

    const {
      test = /\.treat\.(js|ts)$/,
      outputCSS = true,
      outputLoaders = ['style-loader'],
      localIdentName,
      themeIdentName,
      minify,
      browsers,
      hmr,
    } = options;

    this.store = store();
    this.treatCompiler = makeTreatCompiler();

    this.test = test;
    this.minify = minify;
    this.localIdentName = localIdentName;
    this.themeIdentName = themeIdentName;
    this.loaderOptions = {
      outputCSS,
      outputLoaders,
      browsers,
      hmr,
    };
  }

  apply(compiler) {
    const isWebpack5 = Boolean(compiler.webpack && compiler.webpack.version);
    const compat = createCompat(isWebpack5);

    compiler.hooks.watchRun.tap(TWP, (watchCompiler) => {
      const modifiedFiles = compat.getModifiedFiles(watchCompiler);

      this.treatCompiler.expireCache(modifiedFiles);
    });

    compiler.hooks.thisCompilation.tap(TWP, (compilation) => {
      let allCssModules = [];
      let usedCssModules;

      const rebuildModule = (module) =>
        new Promise((resolve) => {
          compilation.rebuildModule(module, () => {
            resolve();
          });
        });

      compilation.hooks.finishModules.tapPromise(TWP, async () => {
        // Filter out css modules that no longer exist (watch mode)
        this.store
          .getAllCssOwners()
          .filter((identifier) => !Boolean(compilation.findModule(identifier)))
          .forEach((identifier) => {
            this.store.deleteCssRequests(identifier);
          });

        // Filter out theme treat modules that no longer exist (watch mode)
        this.store
          .getThemeIdentifiers()
          .filter((identifier) => !Boolean(compilation.findModule(identifier)))
          .forEach((identifier) => {
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
          trace('Rebuiling stale module: %i', moduleIdentifier);
          const treatModule = compilation.findModule(moduleIdentifier);

          if (!treatModule) {
            // In cases where the build fails, sometimes modules are not present
            // on the compilation object. Skip rebuilding in these cases.
            trace(
              "Bail on rebuild of stale module: %i Module doesn't exist on compilation",
              moduleIdentifier,
            );
            return;
          }

          await rebuildModule(treatModule);
        });

        // Modules should be upto date so clear rebuild queue
        this.store.popAllModules();

        if (builtTreatModules.length > 0) {
          // Rebuild all theme modules to ensure they contain upto date css
          await Promise.map(
            this.store.getThemeIdentifiers(),
            async (themeModuleIdentifier) => {
              trace('Rebuiling theme module: %i', themeModuleIdentifier);

              const treatModule = compilation.findModule(themeModuleIdentifier);

              if (!treatModule) {
                // In cases where the build fails, sometimes modules are not present
                // on the compilation object. Skip rebuilding in these cases.
                trace(
                  "Bail on rebuild of theme module: %i Module doesn't exist on compilation",
                  themeModuleIdentifier,
                );
                return;
              }

              await rebuildModule(treatModule);
            },
          );
        }

        const cssResources = this.store
          .getAllThemedCssRequests()
          .map(({ resource }) => resource);

        const getTreatCssResource = (module) => {
          if (
            module.matchResource &&
            cssResources.includes(module.matchResource)
          ) {
            return module.matchResource;
          }

          if (module.type === 'css/mini-extract') {
            const issuer = compat.getModuleIssuer(compilation, module);

            return getTreatCssResource(issuer);
          }

          return null;
        };

        for (const module of compilation._modules.values()) {
          const treatCssResource = getTreatCssResource(module);

          if (treatCssResource) {
            const { owner, type, theme } = this.store.getThemedCssModuleInfo(
              treatCssResource,
            );
            const themeIdentifier = theme
              ? this.store.getTheme(theme).identifier
              : null;

            allCssModules.push({
              type,
              module: compilation.findModule(module.identifier()),
              owner: compilation.findModule(owner),
              themeModule: theme
                ? compilation.findModule(themeIdentifier)
                : null,
              identifier: module.identifier(),
            });
          }
        }
      });

      compilation.hooks.optimizeDependencies.tap(
        // Running during advanced stage means export usage info has been added to the graph already
        { name: TWP, stage: 10 },
        () => {
          // Some modules may not be used and their css can be safely be removed from the chunks
          const cssModuleGroups = partition(
            allCssModules,
            ({ module, owner, themeModule }) => {
              const ownerIsUsed = compat.isModuleUsed(compilation, owner);
              const themeIsUsed =
                !themeModule || compat.isModuleUsed(compilation, themeModule);

              const cssModuleIsUsed = ownerIsUsed && themeIsUsed;

              if (!cssModuleIsUsed) {
                trace(
                  'CSS Module marked for removal due to unused %s %m',
                  chalk.yellow(ownerIsUsed ? 'theme' : 'owner'),
                  module,
                );
              }

              return cssModuleIsUsed;
            },
          );

          usedCssModules = cssModuleGroups[0];
          const cssModulesToRemove = cssModuleGroups[1];

          if (cssModulesToRemove.length > 0) {
            const themeModules = this.store
              .getThemeIdentifiers()
              .map((ident) => compilation.findModule(ident));

            const cssModulesIdentsToRemove = cssModulesToRemove.map(
              ({ identifier }) => identifier,
            );

            for (const themeModule of themeModules) {
              const depsToRemove = themeModule.dependencies.filter((dep) => {
                const depModule = compat.getDependencyModule(compilation, dep);

                const shouldRemove =
                  depModule &&
                  cssModulesIdentsToRemove.includes(depModule.identifier());

                if (shouldRemove) {
                  trace('Mark %m for clean-up in %m', depModule, themeModule);
                }

                return shouldRemove;
              });

              for (const dep of depsToRemove) {
                themeModule.removeDependency(dep);
              }

              compilation.removeReasonsOfDependencyBlock(themeModule, {
                dependencies: depsToRemove,
                blocks: [],
              });
            }
          }
        },
      );

      compilation.hooks.afterChunks.tap(TWP, (chunks) => {
        try {
          // afterChunks hook means module/chunk order properties have been set
          // We can now correct those values by referencing the ordering of the owner treat file
          for (const chunk of chunks) {
            const cssModulesInChunk = usedCssModules.filter(({ module }) =>
              compat.isModuleInChunk(compilation, module, chunk),
            );

            for (const chunkGroup of chunk.groupsIterable) {
              // Corrects ChunkGroup._moduleIndicies
              // Used for mini-extract-css-plugin ordering
              reIndexModules(
                cssModulesInChunk,
                {
                  getPreIndex: ({ module }) =>
                    compat.getCGModulePreOrderIndex(chunkGroup, module),
                  getPostIndex: ({ module }) =>
                    compat.getCGModulePostOrderIndex(chunkGroup, module),
                  getOwnerIndex: ({ owner }) =>
                    compat.getModulePreOrderIndex(compilation, owner),
                  getThemeIndex: ({ themeModule }) =>
                    compat.getModulePreOrderIndex(compilation, themeModule),
                  setPreIndex: ({ module }, i) =>
                    compat.setCGModulePreOrderIndex(chunkGroup, module, i),
                  setPostIndex: ({ module }, i) =>
                    compat.setCGModulePostOrderIndex(chunkGroup, module, i),
                },
                'ChunkGroup moduleIndicies',
              );
            }
          }

          // Corrects Module.index/index2
          reIndexModules(
            usedCssModules,
            {
              getPreIndex: ({ module }) =>
                compat.getModulePreOrderIndex(compilation, module),
              getPostIndex: ({ module }) =>
                compat.getModulePostOrderIndex(compilation, module),
              getOwnerIndex: ({ owner }) =>
                compat.getModulePreOrderIndex(compilation, owner),
              getThemeIndex: ({ themeModule }) =>
                compat.getModulePreOrderIndex(compilation, themeModule),
              setPreIndex: ({ module }, i) =>
                compat.setModulePreOrderIndex(compilation, module, i),
              setPostIndex: ({ module }, i) =>
                compat.setModulePostOrderIndex(compilation, module, i),
            },
            'Module.index/index2',
          );

          this.store
            .getThemeIdentifiers()
            .map((themeModuleIdentifier) =>
              compilation.findModule(themeModuleIdentifier),
            )
            .forEach((themeModule) => {
              const { dependencies } = themeModule;

              const relevantDependencies = usedCssModules
                .map((moduleInfo) => ({
                  ...moduleInfo,
                  dependency: dependencies.find((d) => {
                    const module = compat.getDependencyModule(compilation, d);

                    return (
                      module && module.identifier() === moduleInfo.identifier
                    );
                  }),
                }))
                .filter(({ dependency }) => dependency);

              // Corrects Dependency.sourceOrder
              // Used for regular import chunk sorting, e.g. style-loader
              reIndexModules(
                relevantDependencies,
                {
                  getPreIndex: ({ dependency }) => dependency.sourceOrder,
                  getOwnerIndex: ({ owner }) =>
                    compat.getModulePreOrderIndex(compilation, owner),
                  getThemeIndex: ({ themeModule }) =>
                    compat.getModulePreOrderIndex(compilation, themeModule),
                  setPreIndex: ({ dependency }, i) => {
                    dependency.sourceOrder = i;
                  },
                  // post index not required for dependencies
                  getPostIndex: () => {},
                  setPostIndex: () => {},
                },
                'Dependency.sourceOrder',
              );
            });
        } catch (e) {
          compilation.errors.push(new TreatError(e));
        }
      });
    });

    compiler.hooks.normalModuleFactory.tap(TWP, (nmf) => {
      nmf.hooks.afterResolve.tap(TWP, (result) => {
        if (this.store.getCSSResources().has(result.matchResource)) {
          result.settings = Object.assign({}, result.settings, {
            sideEffects: true,
          });
        }
      });
    });

    const optionDefaulter = makeOptionDefaulter(
      isProductionLikeMode(compiler.options),
    );

    compiler.options.module.rules.splice(
      0,
      0,
      {
        test: this.test,
        use: [
          {
            loader: require.resolve('treat/webpack-plugin/loader'),
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
            },
          },
        ],
      },
      {
        test: /\.treatcss$/,
        sideEffects: true,
        use: [
          ...this.loaderOptions.outputLoaders,
          {
            loader: 'css-loader',
            options: {
              modules: false,
              url: false,
            },
          },
        ],
      },
    );
  }
}
