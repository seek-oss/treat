const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TreatPlugin = require('treat/webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const fixture = process.argv[2];

if (!fixture) {
  throw new Error('No fixture provided');
}

const config = {
  entry: require.resolve(`../packages/treat/tests/fixtures/${fixture}`),
  mode: 'development',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              babelrc: false,
              presets: [
                ['@babel/preset-env', { modules: false }],
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
      outputLoaders: [MiniCssExtractPlugin.loader],
    }),
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin(),
  ],
};

const compiler = webpack(config);

const devServer = new WebpackDevServer(compiler, {
  overlay: true,
});

devServer.listen(8080);
