const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TreatPlugin = require('treat/webpack-plugin');

module.exports = {
  entry: require.resolve('./src/client.tsx'),
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
        use: ['@mdx-js/loader'],
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
