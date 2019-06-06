const anyBase = require('any-base');
const { writeManifest, readManifest } = require('./manifest');

const validClassCharacters = `${anyBase.DEC}abcdefghijklmnopqrstuvwxyz_-`;

const decToIdent = anyBase(anyBase.DEC, validClassCharacters);

const SEP = '?';

module.exports = class AllocationHandler {
  constructor({ manifestFile }) {
    this.newAllocations = false;
    this.allocations = [];
    this.manifestFile = manifestFile;

    this.enableNewAllocations = this.enableNewAllocations.bind(this);
    this.purgeAllocations = this.purgeAllocations.bind(this);
    this.getAllocationKey = this.getAllocationKey.bind(this);
    this.getAllocationIndex = this.getAllocationIndex.bind(this);
    this.allocate = this.allocate.bind(this);
    this.getAllocationIdent = this.getAllocationIdent.bind(this);
    this.getAllocations = this.getAllocations.bind(this);
    this.hydrateAllocations = this.hydrateAllocations.bind(this);
    this.persistAllocations = this.persistAllocations.bind(this);
  }

  enableNewAllocations() {
    console.log('enableNewAllocations');

    this.newAllocations = true;
  }

  getAllocations() {
    return this.allocations;
  }

  async hydrateAllocations() {
    const manifest = await readManifest(this.manifestFile);

    this.allocations = manifest;
  }

  async persistAllocations() {
    await writeManifest(this.manifestFile, this.allocations);
  }

  purgeAllocations(allResourcePaths) {
    this.allocations = this.allocations.map(allocationKey => {
      const [resourcePath] = allocationKey.split(SEP);

      return allResourcePaths.includes(resourcePath) ? allocationKey : null;
    });
  }

  getAllocationKey(resourcePath, scopeIndex) {
    return `${resourcePath}${SEP}${scopeIndex}`;
  }

  getAllocationIndex(allocationKey) {
    return this.allocations.indexOf(allocationKey);
  }

  allocate(allocationKey) {
    const emptyIndex = this.allocations.indexOf(null);

    if (emptyIndex > -1) {
      this.allocations[emptyIndex] = allocationKey;
      return emptyIndex;
    }

    return this.allocations.push(allocationKey) - 1;
  }

  allocationIndexToIdent(allocationIndex) {
    // Shift index up 10 places so ident never starts with number
    return decToIdent(`${allocationIndex + 10}`);
  }

  getAllocationIdent(resourcePath, scopeIndex) {
    const allocationKey = this.getAllocationKey(resourcePath, scopeIndex);
    const allocationIndex = this.getAllocationIndex(allocationKey);

    if (allocationIndex > -1) {
      return this.allocationIndexToIdent(allocationIndex);
    }

    if (this.newAllocations) {
      return this.allocationIndexToIdent(this.allocate(allocationKey));
    }

    return null;
  }
};
