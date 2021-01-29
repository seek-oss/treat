import * as path from 'path';

export default (packageName, binName) => {
  const packageJson = require(`${packageName}/package.json`);
  const binPath =
    typeof packageJson.bin === 'string'
      ? packageJson.bin
      : packageJson.bin[binName || packageName];

  return require.resolve(path.join(packageName, binPath));
};
