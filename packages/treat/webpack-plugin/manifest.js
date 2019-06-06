const path = require('path');
const { promises: fs } = require('fs');

const readManifest = async manifestLocation => {
  return await fs.readFile(path.relative('.', manifestLocation), {
    encoding: 'utf8',
  });
};

const writeManifest = async (manifestLocation, manifest) => {
  await fs.writeFile(
    path.relative('.', manifestLocation),
    JSON.stringify(manifest),
    {
      encoding: 'utf8',
    },
  );
};

module.exports = {
  readManifest,
  writeManifest,
};
