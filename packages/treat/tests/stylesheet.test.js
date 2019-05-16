const bent = require('bent');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const startFixture = require('../../../test-helpers/startServer');
const TreatPlugin = require('../webpack-plugin');

const getString = bent('string');
const cssFileName = 'main.css';

const configVariations = [
  {
    label: 'Development mode',
    config: () => ({
      mode: 'development',
      plugins: [
        new TreatPlugin({
          browsers: ['chrome > 70'],
          outputLoaders: [MiniCssExtractPlugin.loader],
        }),
        new MiniCssExtractPlugin({
          filename: cssFileName,
        }),
      ],
    }),
  },
  {
    label: 'Production mode',
    config: () => ({
      mode: 'production',
      plugins: [
        new TreatPlugin({
          browsers: ['chrome > 70'],
          outputLoaders: [MiniCssExtractPlugin.loader],
        }),
        new MiniCssExtractPlugin({
          filename: cssFileName,
        }),
      ],
    }),
  },
  {
    label: 'Custom idents',
    config: () => ({
      plugins: [
        new TreatPlugin({
          browsers: ['chrome > 70'],
          minify: false,
          localIdentName: '[name]-[local]_[hash:base64:5]',
          themeIdentName: '-[local]_[hash:base64:2]',
          outputLoaders: [MiniCssExtractPlugin.loader],
        }),
        new MiniCssExtractPlugin({
          filename: cssFileName,
        }),
      ],
    }),
  },
  {
    label: 'Theme function ident',
    config: () => ({
      plugins: [
        new TreatPlugin({
          browsers: ['chrome > 70'],
          minify: false,
          themeIdentName: theme => `_${theme.name}_[hash:base64:2]`,
          outputLoaders: [MiniCssExtractPlugin.loader],
        }),
        new MiniCssExtractPlugin({
          filename: cssFileName,
        }),
      ],
    }),
  },
  {
    label: 'Autoprefixer (iOS 8)',
    config: () => ({
      plugins: [
        new TreatPlugin({
          minify: false,
          browsers: ['ios 8'],
          outputLoaders: [MiniCssExtractPlugin.loader],
        }),
        new MiniCssExtractPlugin({
          filename: cssFileName,
        }),
      ],
    }),
  },
];

const fixtureEntries = [
  { fixtureName: 'Simple', entry: './fixtures/simple/index.js' },
  { fixtureName: 'Themed', entry: './fixtures/themed/index.js' },
  {
    fixtureName: 'Unused modules',
    entry: './fixtures/unused-modules/index.js',
  },
  {
    fixtureName: 'Complex selectors',
    entry: './fixtures/complex-selectors/index.js',
  },
  {
    fixtureName: 'Multi file',
    entry: './fixtures/multi-file/index.js',
  },
  {
    fixtureName: 'Animations',
    entry: './fixtures/animations/index.js',
  },
];

describe('Stylesheet', () => {
  let server;

  configVariations.forEach(({ label, config }) => {
    fixtureEntries.forEach(({ fixtureName, entry }) => {
      describe(`${fixtureName} - ${label} -`, () => {
        beforeAll(async () => {
          server = await startFixture({
            entry: require.resolve(entry),
            ...config(),
          });
        });

        it('should create a deterministic stylesheet', async () => {
          const styles = await getString(`${server.url}/${cssFileName}`);

          expect(styles).toMatchSnapshot();
        });

        afterAll(() => {
          server.close();
        });
      });
    });
  });
});
