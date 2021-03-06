const path = require('path');
const fs = require('fs/promises');

const cleanupFiles = [
  path.join(__dirname, 'packages/treat/dist/treat.cjs.dev.js'),
  path.join(__dirname, 'packages/treat/dist/treat.cjs.prod.js'),
  path.join(__dirname, 'packages/treat/dist/treat.esm.js'),
];

async function run() {
  for (const filePath of cleanupFiles) {
    const contents = await fs.readFile(filePath, 'utf-8');

    const newContents = contents.replace(
      /typeof window === 'undefined' \? (createTheme|style|styleMap|styleTree|globalStyle) : null/g,
      '$1',
    );

    await fs.writeFile(filePath, newContents, 'utf-8');
  }
}

run();
