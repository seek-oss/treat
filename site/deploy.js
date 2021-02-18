const path = require('path');
const run = require('@jamesives/github-pages-deploy-action').default;

run({
  branch: 'gh-pages',
  folder: path.join(__dirname, 'dist'),
  repositoryName: 'seek-oss/treat',
  token: process.env.GITHUB_TOKEN,
});
