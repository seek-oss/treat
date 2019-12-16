import execa from 'execa';
import * as path from 'path';
import waitForLocalhost from 'wait-for-localhost';
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
let gatsbyProcess;

async function navigateToServerWhenReady(port) {
  await waitForLocalhost({ port });
  await page.goto(`http://localhost:${port}/`);
}

async function startDevServer() {
  console.log('startDevServer');
  gatsbyProcess = execa(`${gatsbyBinaryPath} develop -p 5678`, gatsbyExecArgs);
  gatsbyProcess.stdout.pipe(process.stdout);
  gatsbyProcess.stderr.pipe(process.stdout);
  await navigateToServerWhenReady(5678);
}

async function startProdServer() {
  console.log('startProdServer');
  await execa(`${gatsbyBinaryPath} build`, gatsbyExecArgs);
  gatsbyProcess = execa(`${gatsbyBinaryPath} serve -p 5688`, {
    shell: true,
    cwd: gatsbyFixturePath,
  });
  gatsbyProcess.stdout.pipe(process.stdout);
  gatsbyProcess.stderr.pipe(process.stdout);
  await navigateToServerWhenReady(5688);
}

async function stopServer() {
  console.log('stopServer');
  gatsbyProcess.kill({ forceKillAfterTimeout: 1000 });
  console.log('server stopped');
}

describe('gatsby', () => {
  describe('develop', () => {
    beforeAll(() => startDevServer());
    afterAll(() => stopServer());

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
    beforeAll(() => startProdServer());
    afterAll(() => stopServer());

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
