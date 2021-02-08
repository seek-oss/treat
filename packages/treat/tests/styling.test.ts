import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import startFixture from 'treat-test-helpers/startServer';
import getStyles from 'treat-test-helpers/getStyles';
import { TreatPlugin } from 'treat/webpack-plugin';

const mainSelector = '#main';

const configVariations = [
  {
    label: 'style-loader',
    config: () => ({
      plugins: [new TreatPlugin()],
    }),
  },
  {
    label: 'mini-css-extract-loader',
    config: () => ({
      optimization: {
        splitChunks: {
          cacheGroups: {
            styles: {
              name: 'styles',
              type: 'css/mini-extract',
              chunks: 'all',
              enforce: true,
            },
          },
        },
      },
      plugins: [
        new TreatPlugin({
          outputLoaders: [MiniCssExtractPlugin.loader],
        }),
        new MiniCssExtractPlugin(),
      ],
    }),
  },
  {
    label: 'development mode (style-loader)',
    config: () => ({
      mode: 'development',
      plugins: [new TreatPlugin()],
    }),
  },
];

describe('Styling and specificity', () => {
  configVariations.forEach(({ label, config }) => {
    describe(`Simple - ${label} - `, () => {
      let server: any;

      beforeAll(async () => {
        server = await startFixture({
          entry: require.resolve('./fixtures/simple/index.ts'),
          ...config(),
        });
        await page.goto(server.url);
      });

      describe('on mobile', () => {
        beforeAll(async () => {
          await page.setViewport({ width: 400, height: 800 });
        });

        it('should be styled correctly', async () => {
          const styles = await getStyles(page, mainSelector);

          expect(styles).toMatchSnapshot();
        });
      });

      describe('on desktop', () => {
        beforeAll(async () => {
          await page.setViewport({ width: 1200, height: 900 });
        });

        it('should be styled correctly', async () => {
          const styles = await getStyles(page, mainSelector);

          expect(styles).toMatchSnapshot();
        });

        describe('and hovered', () => {
          beforeAll(async () => {
            await page.hover(mainSelector);
          });

          it('should be styled correctly', async () => {
            const styles = await getStyles(page, mainSelector);

            expect(styles).toMatchSnapshot();
          });
        });
      });

      afterAll(() => {
        server.close();
      });
    });

    describe(`Themed - ${label}`, () => {
      let server: any;

      beforeAll(async () => {
        server = await startFixture({
          entry: require.resolve('./fixtures/themed/index.ts'),
          ...config(),
        });
        await page.goto(server.url);
      });

      it('should be styled correctly with theme one', async () => {
        const styles = await getStyles(page, '#theme1');

        expect(styles).toMatchSnapshot();
      });

      it('should be styled correctly with theme two', async () => {
        const styles = await getStyles(page, '#theme2');

        expect(styles).toMatchSnapshot();
      });

      afterAll(() => {
        server.close();
      });
    });

    describe(`Dynamic imports - ${label}`, () => {
      let server: any;

      beforeAll(async () => {
        server = await startFixture({
          entry: require.resolve('./fixtures/dynamic-imports/index.ts'),
          ...config(),
        });
        await page.goto(server.url);
      });

      describe('on mobile', () => {
        beforeAll(async () => {
          await page.setViewport({ width: 400, height: 800 });
        });

        it('theme A should be styled correctly', async () => {
          const styles = await getStyles(page, '#themeA');

          expect(styles).toMatchSnapshot();
        });

        it('theme B should be styled correctly', async () => {
          const styles = await getStyles(page, '#themeB');

          expect(styles).toMatchSnapshot();
        });
      });

      afterAll(() => {
        server.close();
      });
    });

    describe(`Unused modules - ${label}`, () => {
      let server: any;

      beforeAll(async () => {
        server = await startFixture({
          entry: require.resolve('./fixtures/unused-modules/index.ts'),
          ...config(),
        });
        await page.goto(server.url);
      });

      it('should be styled correctly', async () => {
        const styles = await getStyles(page, mainSelector);

        expect(styles).toMatchSnapshot();
      });

      afterAll(() => {
        server.close();
      });
    });
  });
});
