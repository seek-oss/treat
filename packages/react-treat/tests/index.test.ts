import { TreatPlugin } from 'treat/webpack-plugin';
import startFixture from '../../../test-helpers/startServer';
import getStyles from '../../../test-helpers/getStyles';

describe('React', () => {
  let server: any;

  beforeAll(async () => {
    server = await startFixture({
      entry: require.resolve('./fixtures/simple-app/client.tsx'),
      plugins: [new TreatPlugin()],
    });
    await page.goto(server.url);
  });

  it('element should be styled correctly', async () => {
    const styles = await getStyles(page, '#main');

    expect(styles).toMatchInlineSnapshot(`
      Object {
        "background-color": "#00f",
        "color": "#ff0",
        "display": "block",
        "height": "12px",
        "width": "400px",
      }
    `);
  });

  afterAll(() => {
    server.close();
  });
});
