import run from '@jamesives/github-pages-deploy-action';

run({
  branch: 'gh-pages',
  folder: 'site/dist',
});
