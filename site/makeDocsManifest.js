const { resolve } = require('path');
const { writeFileSync } = require('fs');
const glob = require('fast-glob');

const docs = glob.sync([`*.{md,mdx}`], {
  cwd: resolve(__dirname, '../docs'),
});

writeFileSync(resolve(__dirname, 'docs-manifest.json'), JSON.stringify(docs));
