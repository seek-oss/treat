const TreatPlugin = require('treat/webpack-plugin');
const startFixture = require('../../../test-helpers/startServer');
const getStyles = require('../../../test-helpers/getStyles');

describe('React', () => {
  let server;

  beforeAll(async () => {
    server = await startFixture({
      entry: require.resolve('./fixture/client.js'),
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
