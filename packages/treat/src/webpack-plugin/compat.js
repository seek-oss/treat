const webpack4 = () => ({
  isModuleUsed: (module) =>
    typeof module.used === 'boolean' ? module.used : true,
  getDependencyModule: (dependency) => dependency.module,
  getModulePreOrderIndex: (module) => module.index,
  setModulePreOrderIndex: (module, index) => (module.index = index),
  getModulePostOrderIndex: (module) => module.index2,
  setModulePostOrderIndex: (module, index) => (module.index2 = index),
  getCGModulePreOrderIndex: (chunkGroup, module) =>
    chunkGroup.getModuleIndex(module),
  setCGModulePreOrderIndex: (chunkGroup, module, index) =>
    chunkGroup.setModuleIndex(module, index),
  getCGModulePostOrderIndex: (chunkGroup, module) =>
    chunkGroup.getModuleIndex2(module),
  setCGModulePostOrderIndex: (chunkGroup, module, index) =>
    chunkGroup.setModuleIndex2(module, index),
  isModuleInChunk: (module, chunk) => chunk.containsModule(module),
});

const webpack5 = (compilation) => {
  const { moduleGraph } = compilation;

  return {
    isModuleUsed: (module) => {
      const exportsInfo = moduleGraph.getExportsInfo(module);

      return exportsInfo.isModuleUsed('main');
    },
    getDependencyModule: (dependency) => moduleGraph.getModule(dependency),
    getModulePreOrderIndex: (module) => moduleGraph.getPreOrderIndex(module),
    setModulePreOrderIndex: (module, index) =>
      moduleGraph.setPreOrderIndex(module, index),
    getModulePostOrderIndex: (module) => moduleGraph.getPostOrderIndex(module),
    setModulePostOrderIndex: (module, index) =>
      moduleGraph.setPostOrderIndex(module, index),
    getCGModulePreOrderIndex: (chunkGroup, module) =>
      chunkGroup.getModulePreOrderIndex(module),
    setCGModulePreOrderIndex: (chunkGroup, module, index) =>
      chunkGroup.setModulePreOrderIndex(module, index),
    getCGModulePostOrderIndex: (chunkGroup, module) =>
      chunkGroup.getModulePostOrderIndex(module),
    setCGModulePostOrderIndex: (chunkGroup, module, index) =>
      chunkGroup.setModulePostOrderIndex(module, index),
    isModuleInChunk: (module, chunk) =>
      compilation.chunkGraph.isModuleInChunk(module, chunk),
  };
};

export const compilationCompat = (version, compilation) => {
  if (version.startsWith('5')) {
    return webpack5(compilation);
  }
  return webpack4(compilation);
};
