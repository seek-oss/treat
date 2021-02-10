import React, { Fragment } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { HeadProvider } from 'react-head';
import App from './App';
import { StatsCompilation } from 'webpack';

type HeadTags = React.ReactElement<unknown>[];

const render = (route: string, headTags: HeadTags, basename: string) =>
  renderToString(
    <StaticRouter location={route} basename={basename}>
      <HeadProvider headTags={headTags}>
        <App />
      </HeadProvider>
    </StaticRouter>,
  );

const fullyQualifiedUrl = (path: string) =>
  `${
    process.env.NODE_ENV === 'production'
      ? 'https://seek-oss.github.io'
      : 'http://localhost:8080'
  }${path}`;

const getBasePath = (publicPath: string) =>
  publicPath.endsWith('/')
    ? publicPath.substr(0, publicPath.length - 1)
    : publicPath;

interface RenderParams {
  route: string;
  publicPath: string;
  entrypoints: NonNullable<StatsCompilation['entrypoints']>;
}
export default ({ route, publicPath, entrypoints }: RenderParams) => {
  const basePath = getBasePath(publicPath);

  const assetPath = (filename: string) => `${publicPath}${filename}`;
  const assets = entrypoints.main.assets;

  if (!assets) {
    throw new Error('No assets!');
  }

  const cssAssets = assets
    .filter((asset) => asset.name.endsWith('.css'))
    .map(
      (asset) =>
        `<link rel="stylesheet" href="${assetPath(asset.name)}"></link>`,
    );
  const jsAssets = assets
    .filter((asset) => asset.name.endsWith('.js'))
    .map((asset) => `<script src="${assetPath(asset.name)}"></script>`);

  const headTags: HeadTags = [];
  const html = render(route, headTags, basePath);

  const favicon = (size: number) =>
    `<link rel="icon" type="image/png" sizes="${size}x${size}" href="${fullyQualifiedUrl(
      assetPath(`favicon-${size}x${size}.png`),
    )}" />`;

  const shareImageUrl = fullyQualifiedUrl(assetPath('og-image.png'));

  return `<html>
    <head>
      <link href="https://fonts.googleapis.com/css?family=DM+Sans:700&display=swap" rel="stylesheet">
      ${cssAssets.join('\n')}
      ${renderToString(<Fragment>{headTags}</Fragment>)}
      <meta name="viewport" content="width=device-width, initial-scale=1">
      ${favicon(16)}
      ${favicon(32)}
      ${favicon(96)}
      <meta property="og:image" content="${shareImageUrl}" />
      <meta property="og:image:width" content="1200">
      <meta property="og:image:height" content="600">
      <meta property="og:type" content="website">
      <meta property="og:site_name" content="treat">
      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:image" content="${shareImageUrl}" />
    </head>
    <body>
        <div id="app">${html}</div>
        <script>window.BASE_URL = ${JSON.stringify(basePath)};</script>
        ${jsAssets.join('\n')}
    </body>
  </html>`;
};
