import execa from 'execa';
import * as path from 'path';
import waitForLocalhost from 'wait-for-localhost';
import getStyles from 'treat-test-helpers/getStyles';
import resolveBin from 'treat-test-helpers/resolveBin';

const gatsbyServerPort = 9999;
const gatsbyBinaryPath = resolveBin('gatsby', 'gatsby');
const gatsbyFixturePath = path.dirname(
  require.resolve('gatsby-plugin-treat-example/package.json'),
);
const gatsbyExecArgs = {
  shell: '/bin/bash',
  cwd: gatsbyFixturePath,
  env: {
    NODE_ENV: 'development',
  },
  extendEnv: true,
};
let gatsbyProcess;

async function navigateToServerWhenReady() {
  await waitForLocalhost({ port: gatsbyServerPort });
  await page.goto(`http://localhost:${gatsbyServerPort}/`);
}

async function startDevServer() {
  gatsbyProcess = execa(
    `${gatsbyBinaryPath} develop -p ${gatsbyServerPort}`,
    gatsbyExecArgs,
  );
  gatsbyProcess.stdout.pipe(process.stdout);
  gatsbyProcess.stderr.pipe(process.stdout);
  await navigateToServerWhenReady();
}

async function startProdServer() {
  await execa(`${gatsbyBinaryPath} build`, gatsbyExecArgs);
  gatsbyProcess = execa(
    `${gatsbyBinaryPath} serve -p ${gatsbyServerPort}`,
    gatsbyExecArgs,
  );
  gatsbyProcess.stdout.pipe(process.stdout);
  gatsbyProcess.stderr.pipe(process.stdout);
  await navigateToServerWhenReady();
}

async function stopServer() {
  gatsbyProcess.kill();
  await gatsbyProcess;
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
