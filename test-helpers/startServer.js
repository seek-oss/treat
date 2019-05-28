import webpack from 'webpack';
import MemoryFS from 'memory-fs';
import express from 'express';
import mime from 'mime-types';
import merge from 'webpack-merge';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const build = config =>
  new Promise((resolve, reject) => {
    const defaultConfig = {
      output: { path: '/' },
      resolve: {
        extensions: ['.js', '.json', '.ts', '.tsx'],
      },
      module: {
        rules: [
          {
            test: /\.(js|ts|tsx)$/,
            use: [
              {
                loader: 'babel-loader',
                options: {
                  babelrc: false,
                  presets: [
                    ['@babel/preset-env', { modules: false }],
                    '@babel/preset-react',
                    '@babel/preset-typescript',
                  ],
                  plugins: [
                    '@babel/plugin-syntax-dynamic-import',
                    'babel-plugin-treat',
                  ],
                },
              },
            ],
          },
        ],
      },
      plugins: [new HtmlWebpackPlugin()],
    };

    const compiler = webpack(merge(defaultConfig, config));

    const outputFileSystem = new MemoryFS();
    compiler.outputFileSystem = outputFileSystem;

    compiler.run((err, stats) => {
      if (err) {
        reject(err);
      }

      if (stats.hasErrors()) {
        reject(
          new Error(
            stats.toString({
              errorDetails: true,
            }),
          ),
        );
      }

      resolve(outputFileSystem);
    });
  });

const startServer = fs =>
  new Promise(resolve => {
    const app = express();

    app.get('*', (req, res) => {
      let filePath = req.path;

      if (req.path === '/') {
        filePath = '/index.html';
      }

      try {
        const file = fs.readFileSync(filePath).toString();

        res.set('Content-Type', mime.lookup(filePath));
        res.send(file);
      } catch (e) {
        console.error(e);

        res.sendStatus(404);
      }
    });

    const server = app.listen(() => {
      resolve({
        url: `http://localhost:${server.address().port}`,
        close: () => {
          server.close();
        },
      });
    });
  });

export default async config => {
  const fs = await build(config);

  return await startServer(fs);
};
