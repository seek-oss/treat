const webpack4 = {
  isWebpack5: false,
  isModuleUsed: (_compilation, module) =>
    typeof module.used === 'boolean' ? module.used : true,
  getDependencyModule: (_compilation, dependency) => dependency.module,
  getModulePreOrderIndex: (_compilation, module) => module.index,
  setModulePreOrderIndex: (_compilation, module, index) =>
    (module.index = index),
  getModulePostOrderIndex: (_compilation, module) => module.index2,
  setModulePostOrderIndex: (_compilation, module, index) =>
    (module.index2 = index),
  getCGModulePreOrderIndex: (chunkGroup, module) =>
    chunkGroup.getModuleIndex(module),
  setCGModulePreOrderIndex: (chunkGroup, module, index) =>
    chunkGroup.setModuleIndex(module, index),
  getCGModulePostOrderIndex: (chunkGroup, module) =>
    chunkGroup.getModuleIndex2(module),
  setCGModulePostOrderIndex: (chunkGroup, module, index) =>
    chunkGroup.setModuleIndex2(module, index),
  isModuleInChunk: (_compilation, module, chunk) =>
    chunk.containsModule(module),
  getModifiedFiles: (watchCompiler) => {
    // watchCompiler.watchFileSystem.watcher is undefined in some node environments.
    // Allow fallback to watchCompiler.watchFileSystem.wfs
    // https://github.com/s-panferov/awesome-typescript-loader/commit/c7da9ac82d105cdaf9b124ccc4c130648e59168a
    const watcher =
      watchCompiler.watchFileSystem.watcher ||
      watchCompiler.watchFileSystem.wfs.watcher;

    return Object.keys(watcher.mtimes);
  },
  getModuleIssuer: (_compilation, module) => module.issuer,
  getNodeTemplatePlugin: () => require('webpack/lib/node/NodeTemplatePlugin'),
  getNodeTargetPlugin: () => require('webpack/lib/node/NodeTargetPlugin'),
  getLimitChunkCountPlugin: () =>
    require('webpack/lib/optimize/LimitChunkCountPlugin'),
  getExternalsPlugin: () => require('webpack/lib/ExternalsPlugin'),
};

const webpack5 = {
  isWebpack5: true,
  isModuleUsed: (compilation, module) => {
    const exportsInfo = compilation.moduleGraph.getExportsInfo(module);

    return exportsInfo.isModuleUsed('main');
  },
  getDependencyModule: (compilation, dependency) =>
    compilation.moduleGraph.getModule(dependency),
  getModulePreOrderIndex: (compilation, module) =>
    compilation.moduleGraph.getPreOrderIndex(module),
  setModulePreOrderIndex: (compilation, module, index) =>
    compilation.moduleGraph.setPreOrderIndex(module, index),
  getModulePostOrderIndex: (compilation, module) =>
    compilation.moduleGraph.getPostOrderIndex(module),
  setModulePostOrderIndex: (compilation, module, index) =>
    compilation.moduleGraph.setPostOrderIndex(module, index),
  getCGModulePreOrderIndex: (chunkGroup, module) =>
    chunkGroup.getModulePreOrderIndex(module),
  setCGModulePreOrderIndex: (chunkGroup, module, index) =>
    chunkGroup.setModulePreOrderIndex(module, index),
  getCGModulePostOrderIndex: (chunkGroup, module) =>
    chunkGroup.getModulePostOrderIndex(module),
  setCGModulePostOrderIndex: (chunkGroup, module, index) =>
    chunkGroup.setModulePostOrderIndex(module, index),
  isModuleInChunk: (compilation, module, chunk) =>
    compilation.chunkGraph.isModuleInChunk(module, chunk),
  getModifiedFiles: (watchCompiler) =>
    watchCompiler.modifiedFiles ? Array.from(watchCompiler.modifiedFiles) : [],
  getModuleIssuer: (compilation, module) =>
    compilation.moduleGraph.getIssuer(module),
  getNodeTemplatePlugin: (compiler) => compiler.webpack.node.NodeTemplatePlugin,
  getNodeTargetPlugin: (compiler) => compiler.webpack.node.NodeTargetPlugin,
  getLimitChunkCountPlugin: (compiler) =>
    compiler.webpack.optimize.LimitChunkCountPlugin,
  getExternalsPlugin: (compiler) => compiler.webpack.ExternalsPlugin,
};

export default (isWebpack5) => {
  if (isWebpack5) {
    return webpack5;
  }
  return webpack4;
};
