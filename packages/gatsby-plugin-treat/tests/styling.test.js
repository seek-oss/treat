import * as path from 'path';
import execa from 'execa';
import waitForLocalhost from 'wait-for-localhost';
import gracefulSpawn from '../../../test-helpers/gracefulSpawn';
import getStyles from '../../../test-helpers/getStyles';
import resolveBin from '../../../test-helpers/resolveBin';

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

    let kill;

    beforeAll(async () => {
      console.log('startDevServer');
      const result = gracefulSpawn(
        `${gatsbyBinaryPath} develop -p ${port}`,
        gatsbyExecArgs,
      );
      kill = result.kill;
      result.childProcess.stdout.pipe(process.stdout);
      result.childProcess.stderr.pipe(process.stdout);
      await navigateToServerWhenReady(port);
    });

    afterAll(async () => {
      await kill();
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
    let kill;

    beforeAll(async () => {
      await execa(`${gatsbyBinaryPath} build`, gatsbyExecArgs);

      const result = gracefulSpawn(`${gatsbyBinaryPath} serve -p ${port}`, {
        shell: true,
        cwd: gatsbyFixturePath,
      });
      kill = result.kill;
      result.childProcess.stdout.pipe(process.stdout);
      result.childProcess.stderr.pipe(process.stdout);

      await navigateToServerWhenReady(port);
    });

    afterAll(async () => {
      await kill();
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
