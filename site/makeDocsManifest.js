const { resolve, join } = require('path');
const { promises } = require('fs');
const glob = require('fast-glob');
const sortBy = require('lodash/sortBy');
const makeDocumentIndex = require('./documentIndexer');

const docs = glob.sync([`*.{md,mdx}`], {
  cwd: resolve(__dirname, '../docs'),
});

(async () => {
  const manifest = await Promise.all(
    sortBy(docs, fileName => fileName).map(async fileName => {
      const [_, routeName] = fileName.match(/^\d-(.*).md/);
      const route = `/${routeName}`;

      return {
        fileName,
        id: routeName,
        route,
        searchData: makeDocumentIndex(
          await promises.readFile(join(__dirname, '../docs', fileName)),
        ),
      };
    }),
  );

  await promises.writeFile(
    resolve(__dirname, 'docs-manifest.json'),
    JSON.stringify(manifest),
  );
})();
