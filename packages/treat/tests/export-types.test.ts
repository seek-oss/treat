import TreatPlugin from '../webpack-plugin';
import startFixture from '../../../test-helpers/startServer';

describe('Export types', () => {
  let server;

  beforeAll(async () => {
    server = await startFixture({
      entry: require.resolve('./fixtures/export-types/index.ts'),
      plugins: [new TreatPlugin()],
    });
    await page.goto(server.url);
  });

  afterAll(() => {
    server.close();
  });

  it('should support objects, arrays, strings, numbers and null/undefined', async () => {
    const html = await page.$eval('#main', el =>
      el.innerHTML.replace(/<br>/g, '\n'),
    );
    expect(html).toMatchInlineSnapshot(`
      "{
        array: [
          'tW7jk'
        ],
        null: null,
        number: 123,
        object: {
          key: 'tW7jk'
        },
        string: 'tW7jk',
        undefined: undefined
      }"
    `);
  });
});
