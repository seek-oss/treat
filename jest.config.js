module.exports = {
  preset: 'jest-puppeteer',
  setupFilesAfterEnv: ['./jest.setup.js'],
  testPathIgnorePatterns: ['<rootDir>/examples'],
};
