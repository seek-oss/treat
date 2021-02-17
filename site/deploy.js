const run = require('@jamesives/github-pages-deploy-action').default;

run({
  branch: 'gh-pages',
  folder: 'site/dist',
});
