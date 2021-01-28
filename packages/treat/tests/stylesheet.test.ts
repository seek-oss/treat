import bent from 'bent';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import startFixture from 'treat-test-helpers/startServer';
// @ts-expect-error
import { TreatPlugin } from 'treat/webpack-plugin';

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
          themeIdentName: (theme: any) => `_${theme.name}_[hash:base64:2]`,
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
  { fixtureName: 'Simple', entry: './fixtures/simple/index.ts' },
  { fixtureName: 'Themed', entry: './fixtures/themed/index.ts' },
  {
    fixtureName: 'Unused modules',
    entry: './fixtures/unused-modules/index.ts',
  },
  {
    fixtureName: 'Complex selectors',
    entry: './fixtures/complex-selectors/index.ts',
  },
  {
    fixtureName: 'Multi file',
    entry: './fixtures/multi-file/index.ts',
  },
  {
    fixtureName: 'Animations',
    entry: './fixtures/animations/index.ts',
  },
  {
    fixtureName: 'Feature queries',
    entry: './fixtures/feature-queries/index.ts',
  },
];

describe('Stylesheet', () => {
  let server: any;

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
