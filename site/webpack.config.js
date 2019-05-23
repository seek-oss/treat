const { join } = require('path');
const HtmlRenderWebpackPlugin = require('html-render-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TreatPlugin = require('treat/webpack-plugin');
const nodeExternals = require('webpack-node-externals');

const docs = require('./docs-manifest.json');

const targetDirectory = join(__dirname, 'dist');

const htmlRenderPlugin = new HtmlRenderWebpackPlugin({
  routes: [{ route: '/' }, ...docs],
  renderConcurrency: 'parralel',
  renderDirectory: targetDirectory,
  mapStatsToParams: ({ webpackStats }) => ({
    clientStats: webpackStats
      .toJson()
      .children.find(({ name }) => name === 'client'),
  }),
});

module.exports = [
  {
    name: 'client',
    output: {
      filename: 'client.js',
      path: targetDirectory,
    },
    entry: require.resolve('./src/client.tsx'),
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    resolve: {
      extensions: ['.js', '.json', '.ts', '.tsx'],
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx|js|mdx?)$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                babelrc: false,
                presets: [
                  '@babel/preset-typescript',
                  ['@babel/preset-env', { modules: false }],
                  '@babel/preset-react',
                ],
              },
            },
          ],
        },
        {
          test: /\.mdx?$/,
          use: ['mdx-loader'],
        },
        {
          test: /\.(png?)$/,
          use: ['file-loader'],
        },
      ],
    },
    plugins: [
      new TreatPlugin({
        localIdentName: '[name]-[local]_[hash:base64:5]',
        themeIdentName: '-theme-[hash:base64:2]',
        outputLoaders: [MiniCssExtractPlugin.loader],
      }),
      new MiniCssExtractPlugin(),
      htmlRenderPlugin,
    ],
    stats: 'errors-only',
  },
  {
    name: 'render',
    target: 'node',
    externals: [nodeExternals()],
    output: {
      filename: 'render.js',
      path: targetDirectory,
      libraryExport: 'default',
      library: 'static',
      libraryTarget: 'umd2',
    },
    entry: require.resolve('./src/render.tsx'),
    mode: 'development',
    resolve: {
      extensions: ['.js', '.json', '.ts', '.tsx'],
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx|js|mdx?)$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                babelrc: false,
                presets: [
                  '@babel/preset-typescript',
                  ['@babel/preset-env', { modules: false }],
                  '@babel/preset-react',
                ],
              },
            },
          ],
        },
        {
          test: /\.mdx?$/,
          use: ['mdx-loader'],
        },
        {
          test: /\.(png?)$/,
          use: ['file-loader'],
        },
      ],
    },
    plugins: [
      new TreatPlugin({
        localIdentName: '[name]-[local]_[hash:base64:5]',
        themeIdentName: '-theme-[hash:base64:2]',
        outputLoaders: [MiniCssExtractPlugin.loader],
        outputCSS: false,
      }),
      new MiniCssExtractPlugin(),
      htmlRenderPlugin.render(),
    ],
    stats: 'errors-only',
  },
];
