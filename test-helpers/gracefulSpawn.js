const { promisify } = require('util');
const execa = require('execa');
const treeKillAsync = promisify(require('tree-kill'));

module.exports = (...args) => {
  const childProcess = execa(...args);

  childProcess.end = async signal => {
    await treeKillAsync(childProcess.pid, signal);

    // Needs a bit more time, for some reason :(
    // If we don't give it a bit of breathing room,
    // Jest complains about handles being left open.
    await new Promise(resolve => setTimeout(resolve, 100));
  };

  return childProcess;
};
