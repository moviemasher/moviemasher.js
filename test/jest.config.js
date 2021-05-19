module.exports = {
  bail: 1,
  rootDir: "../",
  roots: ["<rootDir>/src"],
  coverageDirectory: "./test/coverage",
  setupFilesAfterEnv: ["./test/jest.setup.js"],
  globals: { 'ts-jest': { tsconfig: "test/tsconfig.jest.json" } },
  testEnvironment: 'jsdom',
  testRegex: '/src/.*\\.test?\\.js$',
  moduleFileExtensions: ['ts', 'js'],
  transform: { "^.+\\.[jt]s?$": 'ts-jest' },
}
