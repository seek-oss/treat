const { resolve } = require('path');
const { writeFileSync } = require('fs');
const glob = require('fast-glob');
const sortBy = require('lodash/sortBy');

const docs = glob.sync([`*.{md,mdx}`], {
  cwd: resolve(__dirname, '../docs'),
});

const manifest = sortBy(docs, fileName => fileName).map(fileName => {
  const [_, routeName] = fileName.match(/^\d-(.*).md/);

  return {
    fileName,
    id: routeName,
    route: `/${routeName}`,
  };
});

writeFileSync(
  resolve(__dirname, 'docs-manifest.json'),
  JSON.stringify(manifest),
);
