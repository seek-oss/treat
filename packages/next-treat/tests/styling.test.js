import execa from 'execa';
import * as path from 'path';
import waitForLocalhost from 'wait-for-localhost';
import getStyles from 'treat-test-helpers/getStyles';
import resolveBin from 'treat-test-helpers/resolveBin';

const nextjsServerPort = 9998;
const nextjsBinaryPath = resolveBin('next', 'next');
const nextjsFixturePath = path.dirname(
  require.resolve('next-treat-example/package.json'),
);
const nextjsExecArgs = {
  shell: '/bin/bash',
  cwd: nextjsFixturePath,
  env: {
    NODE_ENV: 'development',
  },
  extendEnv: true,
};
let nextjsProcess;

async function navigateToServerWhenReady() {
  await waitForLocalhost({ port: nextjsServerPort });
  await page.goto(`http://localhost:${nextjsServerPort}/`);
}

async function startDevServer() {
  nextjsProcess = execa(
    `${nextjsBinaryPath} -p ${nextjsServerPort}`,
    nextjsExecArgs,
  );
  nextjsProcess.stdout.pipe(process.stdout);
  nextjsProcess.stderr.pipe(process.stdout);
  await navigateToServerWhenReady();
}

async function startProdServer() {
  await execa(`${nextjsBinaryPath} build`, nextjsExecArgs);
  nextjsProcess = execa(
    `${nextjsBinaryPath} start -p ${nextjsServerPort}`,
    nextjsExecArgs,
  );
  nextjsProcess.stdout.pipe(process.stdout);
  nextjsProcess.stderr.pipe(process.stdout);
  await navigateToServerWhenReady();
}

async function stopServer() {
  nextjsProcess.kill();
  await nextjsProcess;
}

describe('nextjs', () => {
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
