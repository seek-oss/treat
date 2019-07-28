import React, { Fragment } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { HeadProvider } from 'react-head';
import App from './App';

type HeadTags = React.ReactElement<unknown>[];

const render = (route: string, headTags: HeadTags, baseUrl: string) =>
  renderToString(
    <StaticRouter location={route} basename={baseUrl}>
      <HeadProvider headTags={headTags}>
        <App />
      </HeadProvider>
    </StaticRouter>,
  );

interface RenderParams {
  route: string;
  clientStats: any;
}
export default ({ route, clientStats }: RenderParams) => {
  const { publicPath, entrypoints } = clientStats;
  const assetPath = (filename: string) => `${publicPath}${filename}`;
  const assets = entrypoints.main.assets as Array<string>;
  const cssAssets = assets
    .filter(asset => asset.endsWith('.css'))
    .map(asset => `<link rel="stylesheet" href="${assetPath(asset)}"></link>`);
  const jsAssets = assets
    .filter(asset => asset.endsWith('.js'))
    .map(asset => `<script src="${assetPath(asset)}"></script>`);

  const headTags: HeadTags = [];
  const html = render(route, headTags, publicPath);

  const favicon = (size: number) =>
    `<link rel="icon" type="image/png" sizes="${size}x${size}" href="${assetPath(
      `favicon-${size}x${size}.png`,
    )}" />`;

  return `<html>
    <head>
      <link href="https://fonts.googleapis.com/css?family=DM+Sans:700&display=swap" rel="stylesheet">
      ${cssAssets.join('\n')}
      ${renderToString(<Fragment>{headTags}</Fragment>)}
      <meta name="viewport" content="width=device-width, initial-scale=1">
      ${favicon(16)}
      ${favicon(32)}
      ${favicon(96)}
      <meta property="og:image" content="${assetPath('og-image.png')}" />
      <meta property="og:image:width" content="1200">
      <meta property="og:image:height" content="1200">
      <meta property="og:type" content="website">
      <meta property="og:site_name" content="treat">
      <meta name="twitter:card" content="summary">
      <meta name="twitter:image" content="${assetPath('og-image.png')}" />
    </head>
    <body>
        <div id="app">${html}</div>
        <script>window.BASE_URL = ${JSON.stringify(publicPath)};</script>
        ${jsAssets.join('\n')}
    </body>
  </html>`;
};
