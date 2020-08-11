const webpack = require('webpack');
const { join } = require('path');
const WebpackDevServer = require('webpack-dev-server');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TreatPlugin = require('treat/webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const fixture = process.argv[2];

if (!fixture) {
  throw new Error('No fixture provided');
}

const hot = true;

const config = {
  entry: join(
    __dirname,
    '../packages/treat/tests/fixtures',
    fixture,
    'index.ts',
  ),
  resolve: {
    extensions: ['.js', '.json', '.ts', '.tsx'],
  },
  mode: 'development',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              babelrc: false,
              presets: [
                ['@babel/preset-env', { modules: false }],
                '@babel/preset-typescript',
                '@babel/preset-react',
              ],
              plugins: [
                '@babel/plugin-syntax-dynamic-import',
                'babel-plugin-treat',
              ],
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new TreatPlugin({
      outputLoaders: [
        {
          loader: MiniCssExtractPlugin.loader,
          options: { hmr: hot, reloadAll: true },
        },
      ],
      verbose: true,
      hmr: hot,
    }),
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],
};

const compiler = webpack(config);

const devServer = new WebpackDevServer(compiler, {
  overlay: true,
  hot,
});

devServer.listen(8080);
