
const defaults = {
  verbose: true,
  bail: 1,
  maxWorkers: 1, 
  cache: false,
  automock: false,
  rootDir: "./",
  globals: {
    'ts-jest': {
      tsconfig: {
        "allowJs": true,
        "allowSyntheticDefaultImports": true,
        "alwaysStrict": true,
        "checkJs": false,
        "esModuleInterop": true,
        "lib": ["DOM", "ESNext", "ES2020", "ES2019", "ES2018", "ES2017", "ES2016", "ES2015", "ES5"],
        "moduleResolution": "node",
        "resolveJsonModule": true,
        "strict": true,
        "target": "ESNext",
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
      displayName: "Tester",
      preset: "jest-puppeteer",
      testRegex: 'packages/moviemasher.*\\.test\\.e2e\\.ts$',
      setupFilesAfterEnv: ["<rootDir>/jest.puppeteer.setup.js"],
    }
  ]
}
