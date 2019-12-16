import * as path from 'path';
import waitForLocalhost from 'wait-for-localhost';
import getStyles from '../../../test-helpers/getStyles';
import resolveBin from '../../../test-helpers/resolveBin';
import gracefulSpawn from '../../../test-helpers/gracefulSpawn';

const gatsbyBinaryPath = resolveBin('gatsby', 'gatsby');
const gatsbyFixturePath = path.resolve(
  __dirname,
  '../../gatsby-plugin-treat-example',
);
const gatsbyExecArgs = {
  shell: true,
  cwd: gatsbyFixturePath,
  env: {
    NODE_ENV: 'development',
  },
  extendEnv: true,
};

async function navigateToServerWhenReady(port) {
  await waitForLocalhost({ port });
  await page.goto(`http://localhost:${port}/`);
}

describe('gatsby', () => {
  describe('develop', () => {
    const port = 5678;

    let gatsbyProcess;

    beforeAll(async () => {
      console.log('startDevServer');
      gatsbyProcess = gracefulSpawn(
        `${gatsbyBinaryPath} develop -p ${port}`,
        gatsbyExecArgs,
      );
      gatsbyProcess.stdout.pipe(process.stdout);
      gatsbyProcess.stderr.pipe(process.stdout);
      await navigateToServerWhenReady(port);
    });

    afterAll(() => {
      gatsbyProcess.end();
    });

    test('it renders some global styles', async () => {
      const styles = await getStyles(page, 'body');
      expect(styles).toMatchSnapshot();
    });

    test('it renders some button styles', async () => {
      await page.waitForSelector('button');
      const styles = await getStyles(page, 'button');
      expect(styles).toMatchSnapshot();
    });

    test('it loads and renders some span styles', async () => {
      await page.waitForSelector('button');
      await page.click('button');
      await page.waitForSelector('span');
      const styles = await getStyles(page, 'span');
      expect(styles).toMatchSnapshot();
    });
  });

  describe('build', () => {
    const port = 5688;
    let gatsbyProcess;

    beforeAll(async () => {
      await gracefulSpawn(`${gatsbyBinaryPath} build`, gatsbyExecArgs);
      gatsbyProcess = gracefulSpawn(`${gatsbyBinaryPath} serve -p ${port}`, {
        shell: true,
        cwd: gatsbyFixturePath,
      });
      gatsbyProcess.stdout.pipe(process.stdout);
      gatsbyProcess.stderr.pipe(process.stdout);
      await navigateToServerWhenReady(port);
    });

    afterAll(() => {
      gatsbyProcess.end();
    });

    test('it renders some global styles', async () => {
      const styles = await getStyles(page, 'body');
      expect(styles).toMatchSnapshot();
    });

    test('it renders some button styles', async () => {
      await page.waitForSelector('button');
      const styles = await getStyles(page, 'button');
      expect(styles).toMatchSnapshot();
    });

    test('it loads and renders some span styles', async () => {
      await page.waitForSelector('button');
      await page.click('button');
      await page.waitForSelector('span');
      const styles = await getStyles(page, 'span');
      expect(styles).toMatchSnapshot();
    });
  });
});
