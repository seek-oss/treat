module.exports = {
  preset: 'jest-puppeteer',
  setupFilesAfterEnv: ['./jest.setup.js'],
  testPathIgnorePatterns: [
    '<rootDir>/examples',
    '<rootDir>/packages/next-treat',
    '<rootDir>/packages/gatsby-plugin-treat',
  ],
};
