const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TreatPlugin = require('treat/webpack-plugin');

module.exports = {
  entry: './example/client.tsx',
  mode: 'development',
  resolve: {
    extensions: ['.js', '.json', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js)$/,
        use: ['babel-loader'],
      },
    ],
  },
  plugins: [
    new TreatPlugin({
      localIdentName: '[name]-[local]_[hash:base64:5]',
      themeIdentName: '-theme-[hash:base64:2]',
      outputLoaders: [MiniCssExtractPlugin.loader],
    }),
    new HtmlWebpackPlugin(),
    new MiniCssExtractPlugin(),
  ],
  stats: 'errors-only',
};
