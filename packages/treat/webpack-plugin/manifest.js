const path = require('path');
const { promises: fs } = require('fs');

const readManifest = async manifestLocation => {
  const manifestContents = await fs.readFile(
    path.relative('.', manifestLocation),
    {
      encoding: 'utf8',
    },
  );

  return JSON.parse(manifestContents);
};

const writeManifest = async (manifestLocation, manifest) => {
  await fs.writeFile(
    path.relative('.', manifestLocation),
    JSON.stringify(manifest, null, 2),
    {
      encoding: 'utf8',
    },
  );
};

module.exports = {
  readManifest,
  writeManifest,
};
