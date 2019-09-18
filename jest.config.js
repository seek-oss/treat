module.exports = {
  preset: 'jest-puppeteer',
  setupFilesAfterEnv: ['./jest.setup.js'],
  transformIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/packages/treat/webpack-plugin',
    '<rootDir>/packages/*/tests/fixtures',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/packages/gatsby-plugin-treat-example/\\.cache/'
  ]
};
