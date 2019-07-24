const { join } = require('path');
const HtmlRenderWebpackPlugin = require('html-render-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const TreatPlugin = require('treat/webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const docs = require('./docs-manifest.json');
const targetDirectory = join(__dirname, 'dist');

const isProduction = process.env.NODE_ENV === 'production';

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

const sharedTreatOptions = isProduction
  ? {
      localIdentName: '[hash:base64:5]',
      themeIdentName: '[hash:base64:2]',
    }
  : {
      localIdentName: '[name]-[local]_[hash:base64:5]',
      themeIdentName: '-theme-[hash:base64:2]',
    };

const publicPath = isProduction ? '/treat/' : '/';

module.exports = [
  {
    name: 'client',
    output: {
      filename: 'client.js',
      path: targetDirectory,
      publicPath,
    },
    entry: require.resolve('./src/client.tsx'),
    mode: isProduction ? 'production' : 'development',
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
                plugins: ['babel-plugin-treat'],
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
        ...sharedTreatOptions,
        outputLoaders: [MiniCssExtractPlugin.loader],
      }),
      new MiniCssExtractPlugin(),
      htmlRenderPlugin,
      new CopyPlugin([
        {
          from: join(__dirname, 'src/assets'),
        },
      ]),
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
      publicPath,
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
                plugins: ['babel-plugin-treat'],
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
        ...sharedTreatOptions,
        outputCSS: false,
      }),
      new MiniCssExtractPlugin(),
      htmlRenderPlugin.render(),
    ],
    stats: 'errors-only',
  },
];
