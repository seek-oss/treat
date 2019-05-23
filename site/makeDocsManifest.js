const { resolve } = require('path');
const { writeFileSync } = require('fs');
const glob = require('fast-glob');
const sortBy = require('lodash/sortBy');

const docs = glob.sync([`*.{md,mdx}`], {
  cwd: resolve(__dirname, '../docs'),
});

const manifest = sortBy(docs, fileName => fileName).map(fileName => ({
  fileName,
  route: `/${fileName.match(/^\d-(.*).md/)[1]}`,
}));

writeFileSync(
  resolve(__dirname, 'docs-manifest.json'),
  JSON.stringify(manifest),
);
