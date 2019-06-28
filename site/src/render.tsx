import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';

import App from './App';

const render = (route: string) =>
  renderToString(
    <StaticRouter location={route}>
      <App />
    </StaticRouter>,
  );

interface RenderParams {
  route: string;
  clientStats: any;
}
export default ({ route, clientStats }: RenderParams) => {
  const assets = clientStats.entrypoints.main.assets as Array<string>;

  const cssAssets = assets
    .filter(asset => asset.endsWith('.css'))
    .map(asset => `<link rel="stylesheet" href="${asset}"></link>`);
  const jsAssets = assets
    .filter(asset => asset.endsWith('.js'))
    .map(asset => `<script src="${asset}"></script>`);

  return `<html>
    <head>
      <link href="https://fonts.googleapis.com/css?family=DM+Sans:700&display=swap" rel="stylesheet">
      ${cssAssets.join('\n')}
    </head>
    <body>
        <div id="app">${render(route)}</div>
        ${jsAssets.join('\n')}
    </body>
  </html>`;
};
