
const defaults = {
  verbose: true,
  cache: false,
  automock: false,
  rootDir: "./",
  globals: {
    'ts-jest': {
      tsconfig: {
        "lib": ["DOM", "ESNext", "ES2020", "ES2019", "ES2018", "ES2017", "ES2016", "ES2015", "ES5"],
        "target": "ES2015",
        "esModuleInterop": true,
        "strict": true,
        "allowJs": true,
        "checkJs": false,
        "resolveJsonModule": true,
        "moduleResolution": "node",
        "allowSyntheticDefaultImports": true,
      }
    }
  },
  moduleFileExtensions: ['ts', 'js'],
  transform: { "^.+\\.[jt]s?$": 'ts-jest' }
}
module.exports = {
  projects: [
    {
      ...defaults,
      coverageDirectory: "./temporary/test/coverage",
      collectCoverageFrom: ["./src/**/*.ts"],
      setupFilesAfterEnv: ["<rootDir>/dev/test/jest.setup.js"],
      testRegex: 'packages/.*\\.test\\.ts$',
      testEnvironment: "jsdom",
    }, {
      ...defaults,
      preset: "jest-puppeteer",
      testRegex: 'packages/.*\\.test\\.e2e\\.ts$',
      setupFilesAfterEnv: ["<rootDir>/dev/test/jest.puppeteer.setup.js"],
    }
  ]
}
