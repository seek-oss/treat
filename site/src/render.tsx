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
  const assets = clientStats.entrypoints.main.assets.map((asset: string) =>
    asset.endsWith('.css')
      ? `<link rel="stylesheet" href="${asset}"></link>`
      : `<script src="${asset}"></script>`,
  );

  return `<html>
    <body>
        <div id="app">${render(route)}</div>
        ${assets.join('\n')}
    </body>
  </html>`;
};
