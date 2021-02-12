import startFixture from 'treat-test-helpers/startServer';
import { TreatPlugin } from 'treat/webpack-plugin';

describe('Export types', () => {
  let server: any;

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
    const html = await page.$eval('#main', (el) =>
      el.innerHTML.replace(/<br>/g, '\n'),
    );
    expect(html).toMatchInlineSnapshot(`
      "{
        array: [
          '_31E_q'
        ],
        null: null,
        number: 123,
        object: {
          key: '_31E_q'
        },
        string: '_31E_q',
        undefined: undefined
      }"
    `);
  });
});
